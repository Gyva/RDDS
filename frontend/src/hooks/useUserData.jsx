import { useState, useEffect } from 'react';
import axios from 'axios';  // Assuming you are using axios to fetch data

// Custom hook to fetch user data based on ID and role
const useUserData = (userID, role) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/users/${userID}?role=${role}`);
        setUserData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userID && role) {
      fetchUserData();
    }
  }, [userID, role]);

  return { userData, loading, error };
};

export default useUserData;
