import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        setUserData(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const response = await fetch(
          `https://ourheritage.runasp.net/api/Users/${userId}`,
          {
            headers: {
              accept: '*/*',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        console.log('Fetched Data:', data); // تحقق من البيانات المسترجعة
        setUserData({
          firstName: data.firstName,
          lastName: data.lastName,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setUserData({
          firstName: '',
          lastName: '',
          isLoading: false,
          error: error.message
        });
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const fullName = `${userData.firstName} ${userData.lastName}`.trim();

  return (
    <UserContext.Provider value={{ ...userData, fullName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
