import React from 'react';
import { Activity, LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleTranslate from './GoogleTranslate';

const NAV_LINKS = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'News', path: '/news' },
    { label: 'Heatmap', path: '/heatmap' },
    { label: 'Analyze Symptoms', path: '/analyze-symptoms' },
];

const Navbar = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();
    const currentPath = location.pathname;

    const handleLogout = () => {
        logout();
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-20">
            <div className="px-4 sm:px-6">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleSidebar}
                            className="md:hidden p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <Activity className="h-6 w-6 text-emerald-600" />
                        </button>

                        <div
                            className="flex items-center space-x-3 cursor-pointer"
                            onClick={() => handleNavigation('/dashboard')}
                        >
                            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
                                <Activity className="h-5 w-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">HealthGuard Pro</h1>
                            <p className="text-xs text-gray-500 hidden md:block">Advanced Disease Monitoring</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-1 bg-gray-50 rounded-xl p-1">
                            {NAV_LINKS.map((link) => {
                                const isActive = link.path === currentPath;
                                return (
                                    <button
                                        key={link.path}
                                        onClick={() => handleNavigation(link.path)}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${isActive
                                            ? 'text-white bg-emerald-600 hover:bg-emerald-700'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                                            }`}
                                    >
                                        {link.label}
                                    </button>
                                );
                            })}
                        </div>

                        <GoogleTranslate />

                        <div className="flex items-center space-x-3">
                            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

                            <div className="flex items-center space-x-2">
                                <div
                                    onClick={() => handleNavigation('/profile')}
                                    className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="h-5 w-5 text-white" />
                                        )}
                                    </div>
                                    <span className="text-sm font-medium hidden lg:block text-gray-700">
                                        {user?.fullname || 'Rohan'}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                                >
                                    <LogOut className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;