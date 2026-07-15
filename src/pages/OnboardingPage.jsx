import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, UserPlus, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OnboardingPage = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        age: '',
        gender: '',
        address: '',
        height: '',
        weight: '',
        blood_group: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        
        if (!formData.age || !formData.gender || !formData.address || !formData.height || !formData.weight || !formData.blood_group) {
            setError('Please fill in all fields to complete your profile.');
            return;
        }

        const ageNum = Number(formData.age);
        if (ageNum <= 0) {
            setError('Age must be greater than 0.');
            return;
        }

        const heightNum = formData.height ? parseFloat(formData.height) : null;
        if (heightNum !== null && heightNum <= 0) {
            setError('Height must be greater than 0.');
            return;
        }

        const weightNum = formData.weight ? parseFloat(formData.weight) : null;
        if (weightNum !== null && weightNum <= 0) {
            setError('Weight must be greater than 0.');
            return;
        }

        setIsSaving(true);
        setError('');

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

            const updatePayload = {
                email: user.email,
                fullname: user.fullname,
                age: ageNum,
                gender: formData.gender,
                address: formData.address,
                height: heightNum,
                weight: weightNum,
                blood_group: formData.blood_group || null,
                avatar: newAvatar
            };

            const response = await fetch('http://127.0.0.1:5000/api/users/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload)
            });

            if (response.ok) {
                
                const updatedUser = { ...user, ...updatePayload };
                login(updatedUser); 
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Onboarding error:', err);
            setError('Server connection error. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Activity className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Welcome, {user?.fullname?.split(' ')[0] || 'User'}!
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Let's complete your profile to personalize your experience.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Age</label>
                                <div className="mt-1">
                                    <input
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        min="1"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                        placeholder="e.g. 30"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Gender</label>
                                <div className="mt-1">
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Address (City, Country)</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                    placeholder="e.g. New York, USA"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
                                <div className="mt-1">
                                    <input
                                        type="number"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleChange}
                                        min="1"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                        placeholder="e.g. 175"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                                <div className="mt-1">
                                    <input
                                        type="number"
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        min="1"
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                        placeholder="e.g. 70"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                                <div className="mt-1">
                                    <select
                                        name="blood_group"
                                        value={formData.blood_group}
                                        onChange={handleChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                        required
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
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Saving Profile...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5 mr-2" />
                                        Complete Registration
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OnboardingPage;
