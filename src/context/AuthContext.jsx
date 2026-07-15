
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const loggedIn = document.cookie.split('; ').find(row => row.startsWith('loggedIn='));
        if (loggedIn && loggedIn.split('=')[1] === 'true') {
          setIsAuthenticated(true);
          
          const userData = localStorage.getItem('userData');
          if (userData) {
            let parsedUser = JSON.parse(userData);
            if (!parsedUser.avatar && parsedUser.gender) {
              const isFemale = parsedUser.gender === 'Female';
              const genderPrefix = isFemale ? 'f' : 'm';
              const availableNumbers = isFemale ? [1, 5, 6] : [2, 3, 4];
              const randomIdx = Math.floor(Math.random() * availableNumbers.length);
              const randomNum = availableNumbers[randomIdx];
              parsedUser.avatar = `/${genderPrefix}-avatar-${randomNum}.jpg`;
              localStorage.setItem('userData', JSON.stringify(parsedUser));
            }
            setUser(parsedUser);
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const setAuthCookie = (value) => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    document.cookie = `loggedIn=${value}; expires=${date.toUTCString()}; path=/`;
    setIsAuthenticated(value === 'true');
  };

  const login = (userData, redirect = true) => {
    setAuthCookie('true');
    if (!userData.avatar && userData.gender) {
      const isFemale = userData.gender === 'Female';
      const genderPrefix = isFemale ? 'f' : 'm';
      const availableNumbers = isFemale ? [1, 5, 6] : [2, 3, 4];
      const randomIdx = Math.floor(Math.random() * availableNumbers.length);
      const randomNum = availableNumbers[randomIdx];
      userData.avatar = `/${genderPrefix}-avatar-${randomNum}.jpg`;
    }
    setUser(userData);
    
    localStorage.setItem('userData', JSON.stringify(userData));

    
    if (!userData.age || !userData.address || !userData.height || !userData.weight || !userData.blood_group) {
      if (redirect) navigate('/onboarding', { replace: true });
    } else {
      if (redirect) {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    }
  };

  const logout = () => {
    setAuthCookie('false');
    setUser(null);
    
    localStorage.removeItem('userData');
    navigate('/login', { replace: true });
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};