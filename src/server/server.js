
import express from 'express';
import mysql from 'mysql2';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';
import util from 'util';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'disease_dashboard'
};


const db = mysql.createConnection(dbConfig);


db.query = util.promisify(db.query);


db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});


db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullname VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        age INT DEFAULT NULL,
        gender VARCHAR(50) DEFAULT NULL,
        address TEXT DEFAULT NULL,
        height FLOAT DEFAULT NULL,
        weight FLOAT DEFAULT NULL,
        blood_group VARCHAR(10) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (err, result) => {
    if (err) {
        console.error('Error creating users table:', err);
    } else {
        console.log('Users table ready. Checking for missing columns...');
        
        const columnsToAdd = [
            'age INT DEFAULT NULL',
            'gender VARCHAR(50) DEFAULT NULL',
            'address TEXT DEFAULT NULL',
            'height FLOAT DEFAULT NULL',
            'weight FLOAT DEFAULT NULL',
            'blood_group VARCHAR(10) DEFAULT NULL'
        ];

        columnsToAdd.forEach(colDef => {
            const colName = colDef.split(' ')[0];
            db.query(`
                SELECT * FROM information_schema.COLUMNS 
                WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = ?
            `, [process.env.DB_NAME || 'disease_dashboard', colName], (checkErr, results) => {
                if (!checkErr && results.length === 0) {
                    db.query(`ALTER TABLE users ADD COLUMN ${colDef}`, (alterErr) => {
                        if (alterErr) console.error(`Failed to add column ${colName}:`, alterErr);
                        else console.log(`Added column: ${colName}`);
                    });
                }
            });
        });
    }
});



app.get('/api/users/profile/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const [users] = await db.promise().query(
            'SELECT id, fullname, email, age, gender, address, height, weight, blood_group FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.put('/api/users/profile', async (req, res) => {
    try {
        const { email, fullname, age, gender, address, height, weight, blood_group } = req.body;

        await db.promise().query(
            `UPDATE users SET 
                fullname = ?, 
                age = ?, 
                gender = ?, 
                address = ?, 
                height = ?, 
                weight = ?, 
                blood_group = ? 
            WHERE email = ?`,
            [fullname, age, gender, address, height, weight, blood_group, email]
        );

        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/health-data', async (req, res) => {
    try {
        const { country, state, city, disease, timeFilter } = req.query;

        let whereClauses = [];
        let params = [];

        if (disease && disease !== 'all') {
            whereClauses.push('Disease = ?');
            params.push(disease);
        }

        if (city && city !== 'all') {
            whereClauses.push('City = ?');
            params.push(city);
        } else if (state && state !== 'all') {
            whereClauses.push('State = ?');
            params.push(state);
        } else if (country && country !== 'all') {
            whereClauses.push('Country = ?');
            params.push(country);
        }

        switch (timeFilter) {
            case 'today':
                whereClauses.push('Date = CURDATE()');
                break;
            case 'week':
                whereClauses.push('Date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)');
                break;
            case 'month':
                whereClauses.push('Date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)');
                break;
            case 'year':
                whereClauses.push('Date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)');
                break;
            default:
                break;
        }

        const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const query = `
            SELECT 
                CONCAT(YEAR(Date), '-', LPAD(MONTH(Date), 2, '0'), '-', LPAD(DAY(Date), 2, '0')) AS Date,
            Country, State, City, Disease, NewCases, Recovered, Deaths, ActiveCases, AlertLevel 
            FROM global_health_data
            ${whereString}
            ORDER BY Date ASC
            `;

        const results = await db.query(query, params);

        res.status(200).json(results);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching health data', details: error.message });
    }
});



app.get('/api/heatmap/country', async (req, res) => {
    try {
        const { disease, timeFilter } = req.query;

        let whereClauses = [];
        let params = [];

        
        if (disease && disease !== 'all') {
            whereClauses.push('Disease = ?');
            params.push(disease);
        }

        
        switch (timeFilter) {
            case 'today':
                whereClauses.push('Date = CURDATE()');
                break;
            case 'week':
                whereClauses.push('Date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)');
                break;
            case 'month':
                whereClauses.push('Date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)');
                break;
            case 'year':
                whereClauses.push('Date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)');
                break;
            default:
                break;
        }

        const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const query = `
            SELECT 
                Country,
            SUM(NewCases) AS totalCases,
            SUM(Recovered) AS totalRecovered,
            SUM(Deaths) AS totalDeaths
            FROM global_health_data
            ${whereString}
            GROUP BY Country
            ORDER BY totalCases DESC
            `;

        const results = await db.query(query, params);
        res.status(200).json(results);

    } catch (error) {
        console.error('Error fetching country heatmap data:', error);
        res.status(500).json({ message: 'Error fetching heatmap data', details: error.message });
    }
});




app.post('/api/auth/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        
        const [existingUsers] = await db.promise().query(
            'SELECT * FROM users WHERE email = ?', [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        await db.promise().query(
            'INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)',
            [fullname, email, hashedPassword]
        );

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const [users] = await db.promise().query(
            'SELECT * FROM users WHERE email = ?', [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        
        const { password: _, ...userData } = user;
        res.status(200).json({
            message: 'Login successful',
            user: userData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));