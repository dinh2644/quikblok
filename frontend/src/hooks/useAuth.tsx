import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';


const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{[key: string]: any}>({
    _id: "",
    firstName: "",
    password: "",
    lastName: "",
    email: "",
    username: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
 
  const checkAuth = useCallback(async () => {
    try {
      const { data } = await axios.get("/");
      if (data && data.userInfo) {
        setIsAuthenticated(true);
      
        setUser(data)
      } else {
        setIsAuthenticated(false);
        setUser({
            firstName: ""
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setUser({
        firstName: ""
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { isAuthenticated, user, loading, checkAuth };
};

export default useAuth;