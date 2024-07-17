import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();
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
      const { data } = await axios.get("/", { 
        withCredentials: true,
        validateStatus: (status) => status < 500 
      });
      
      if (data && data.userInfo) {
        setIsAuthenticated(true);
        setUser(data);
      } else {
        setIsAuthenticated(false);
        setUser({
          _id: "",
          firstName: "",
          password: "",
          lastName: "",
          email: "",
          username: "",
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setUser({
        _id: "",
        firstName: "",
        password: "",
        lastName: "",
        email: "",
        username: "",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser({
        _id: "",
        firstName: "",
        password: "",
        lastName: "",
        email: "",
        username: "",
      });
    navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);


  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

 

  return { isAuthenticated, user, loading, checkAuth, logout };
};

export default useAuth;