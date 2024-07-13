import React, { ReactElement, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import axios from "axios";
// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmailVerify from './pages/EmailVerified';
import PageNotFound from './pages/PageNotFound';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';

//axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.baseURL = "https://quikblok.onrender.com";
axios.defaults.withCredentials = true;

interface RouteProps {
  element: ReactElement;
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('token') !== null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(token !== null);
    setIsLoading(false);
  }, []);

  // Prevents non-logged in users from accessing x routes
  const PrivateRoute: React.FC<RouteProps> = ({ element }) => {
    if (isLoading) return <div>Loading...</div>;
    return isAuthenticated ? element : <Navigate to="/login"/>;
  };

  // Prevents logged in users from going back to /login and /register routes
  const OnlyUnauthenticated: React.FC<RouteProps> = ({ element }) => {
    if (isLoading) return <div>Loading...</div>;
    return isAuthenticated ? <PageNotFound/> : element;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log(isAuthenticated);
  
  return (
    <>
      <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
      <Routes>
        {/* Main Pages */}
        <Route path="/login" element={<OnlyUnauthenticated element={<Login />} />} />
        <Route path="/register" element={<OnlyUnauthenticated element={<Register />} />} />
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
        {/* Other */}
        <Route path="*" element={<PageNotFound />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
        <Route path="/preverify/:token" element={<EmailVerify />} />
      </Routes>

    </>






  );
};

export default App;
