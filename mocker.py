# pip install mysql-connector-python
# mocker.py

import csv
import mysql.connector

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "", 
    "database": "disease_dashboard"
}
CSV_FILE = "world_health_updated.csv"
BATCH_SIZE = 500

try:
    db = mysql.connector.connect(**DB_CONFIG)
    cursor = db.cursor()
    print("MySQL connection established successfully.")

    sql_insert = """
    INSERT INTO global_health_data
    (Date, Country, State, City, Disease, NewCases, Recovered, Deaths, ActiveCases, AlertLevel)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    with open(CSV_FILE, "r", newline="") as file:
        data_reader = csv.reader(file)
        
        next(data_reader)
        
        batch = []
        rows_inserted = 0

        for row in data_reader:
            batch.append(row)
            
            if len(batch) >= BATCH_SIZE:
                cursor.executemany(sql_insert, batch)
                db.commit()
                rows_inserted += len(batch)
                batch.clear()

        if batch:
            cursor.executemany(sql_insert, batch)
            db.commit()
            rows_inserted += len(batch)

    print(f"\nCompleted successfully! {rows_inserted} records inserted into global_health_data.")

except mysql.connector.Error as err:
    print(f"Database error: {err}")
    
except FileNotFoundError:
    print(f"Error: The file '{CSV_FILE}' was not found.")

finally:
    if 'db' in locals() and db.is_connected():
        cursor.close()
        db.close()
        print("MySQL connection closed.")
