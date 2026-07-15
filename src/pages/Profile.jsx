import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Info, Activity, Save, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, login } = useAuth();

    
    const [formData, setFormData] = useState({
        fullName: user?.fullname || '',
        email: user?.email || '',
        age: user?.age || '',
        gender: user?.gender || '',
        address: user?.address || '',
        height: user?.height || '',
        weight: user?.weight || '',
        blood_group: user?.blood_group || ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [saveMessage, setSaveMessage] = useState('');
    const [error, setError] = useState('');

    
    const [bmi, setBmi] = useState(null);
    const [bmiCategory, setBmiCategory] = useState('');
    const [bmiColor, setBmiColor] = useState('');

    useEffect(() => {
        fetchProfile();
    }, [user?.email]);

    useEffect(() => {
        calculateBmi();
    }, [formData.height, formData.weight]);

    const fetchProfile = async () => {
        if (!user?.email) return;
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/users/profile/${user.email}`);
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    fullName: data.fullname || '',
                    email: data.email || '',
                    age: data.age || '',
                    gender: data.gender || '',
                    address: data.address || '',
                    height: data.height || '',
                    weight: data.weight || '',
                    blood_group: data.blood_group || ''
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateBmi = () => {
        const heightInMeters = parseFloat(formData.height) / 100;
        const weightInKg = parseFloat(formData.weight);

        if (heightInMeters > 0 && weightInKg > 0) {
            const calculatedBmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
            setBmi(calculatedBmi);
            determineBmiCategory(calculatedBmi);
        } else {
            setBmi(null);
            setBmiCategory('');
        }
    };

    const determineBmiCategory = (bmiValue) => {
        if (bmiValue < 18.5) {
            setBmiCategory('Underweight');
            setBmiColor('text-blue-500');
        } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
            setBmiCategory('Normal weight');
            setBmiColor('text-emerald-500');
        } else if (bmiValue >= 25 && bmiValue < 29.9) {
            setBmiCategory('Overweight');
            setBmiColor('text-yellow-500');
        } else {
            setBmiCategory('Obese');
            setBmiColor('text-red-500');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSaveMessage('');

        try {
            let newAvatar = user.avatar;
            const genderPrefix = formData.gender === 'Female' ? 'f' : 'm';

            
            if (!newAvatar || !newAvatar.startsWith(`/${genderPrefix}-`)) {
                const isFemale = genderPrefix === 'f';
                const availableNumbers = isFemale ? [1, 5, 6] : [2, 3, 4];
                const randomIdx = Math.floor(Math.random() * availableNumbers.length);
                const randomNum = availableNumbers[randomIdx];
                newAvatar = `/${genderPrefix}-avatar-${randomNum}.jpg`;
            }

            const payload = {
                email: formData.email,
                fullname: formData.fullName,
                age: formData.age ? Number(formData.age) : null,
                gender: formData.gender,
                address: formData.address,
                height: formData.height ? parseFloat(formData.height) : null,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                blood_group: formData.blood_group || null
            };

            const response = await fetch('http://127.0.0.1:5000/api/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                
                const updatedUser = { ...user, ...payload, avatar: newAvatar };
                login(updatedUser, false);
                setSaveMessage('Profile saved successfully!');
            } else {
                const data = await response.json();
                setError(data.message || 'Error saving profile');
            }
        } catch (error) {
            console.error('Save error:', error);
            setError('Failed to connect to server');
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(''), 3000);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-emerald-600 px-8 py-8 flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
                        <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden border-4 border-emerald-100">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="h-12 w-12 text-emerald-600" />
                            )}
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-white mb-1">
                                {formData.fullName}
                            </h1>
                            <p className="text-emerald-100 flex items-center justify-center sm:justify-start">
                                <Mail className="w-4 h-4 mr-2" />
                                {formData.email}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    
                    <div className="md:col-span-2 space-y-8">

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <Info className="h-5 w-5 mr-2 text-emerald-600" />
                                Personal Information
                            </h2>

                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Age (Years)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Calendar className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleChange}
                                                className="w-full pl-10 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address (City, Country)
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                        placeholder="e.g. New York, USA"
                                    />
                                </div>

                                <div className="border-t border-gray-100 pt-6 mt-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Physical Metrics (For BMI calculation)</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Height (cm)
                                            </label>
                                            <input
                                                type="number"
                                                name="height"
                                                value={formData.height}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                                placeholder="e.g. 175"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Weight (kg)
                                            </label>
                                            <input
                                                type="number"
                                                name="weight"
                                                value={formData.weight}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                                placeholder="e.g. 70"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Blood Group
                                        </label>
                                        <select
                                            name="blood_group"
                                            value={formData.blood_group || ''}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none"
                                        >
                                            <option value="">Select Blood Group</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-red-500 bg-red-50 p-3 rounded-lg text-sm border border-red-100">
                                        {error}
                                    </div>
                                )}

                                <div className="pt-4 flex items-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 sm:flex-none cursor-pointer flex items-center justify-center px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-wait shadow-sm"
                                    >
                                        <Save className="w-5 h-5 mr-2" />
                                        {isSaving ? 'Saving...' : 'Save Profile'}
                                    </button>

                                    {saveMessage && (
                                        <p className="text-emerald-600 font-medium animate-pulse">
                                            {saveMessage}
                                        </p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <Activity className="h-5 w-5 mr-2 text-emerald-600" />
                                Health Metrics
                            </h2>

                            <div className="flex flex-col items-center justify-center py-6 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                <div className="text-sm text-gray-500 font-medium mb-2 uppercase tracking-wide">
                                    Your BMI
                                </div>
                                <div className={`text-6xl font-black mb-2 ${bmiColor || 'text-gray-400'}`}>
                                    {bmi || '--'}
                                </div>
                                <div className={`text-lg font-bold px-4 py-1 flex items-center rounded-full ${bmiCategory ? 'bg-white shadow-sm' : ''} ${bmiColor}`}>
                                    {bmiCategory && <AlertCircle className="w-4 h-4 mr-2" />}
                                    {bmiCategory || 'Enter height & weight'}
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                                    BMI Categories
                                </h3>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Underweight</span>
                                    <span className="font-medium text-blue-500">&lt; 18.5</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Normal</span>
                                    <span className="font-medium text-emerald-500">18.5 - 24.9</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Overweight</span>
                                    <span className="font-medium text-yellow-500">25 - 29.9</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Obese</span>
                                    <span className="font-medium text-red-500">&ge; 30</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-md">
                            <h3 className="font-bold text-lg mb-2">Feeling Unwell?</h3>
                            <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
                                Use our AI-powered Symptom Analyzer to get immediate insights about potential health conditions.
                            </p>
                            <a
                                href="/analyze-symptoms"
                                className="inline-block px-4 py-2 bg-white text-indigo-600 font-bold rounded-lg text-sm hover:bg-gray-50 transition-colors w-full text-center cursor-pointer"
                            >
                                Analyze Symptoms
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;