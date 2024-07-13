import React, { ReactElement, useState } from 'react';
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
import RefreshHandler from './components/RefreshHandler';

//axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.baseURL = "https://quikblok.onrender.com";
axios.defaults.withCredentials = true;

interface RouteProps {
  element: ReactElement;
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const PrivateRoute: React.FC<RouteProps> = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login"/>;
  };

  const OnlyUnauthenticated: React.FC<RouteProps> = ({ element }) => {
    return isAuthenticated ? <PageNotFound/> : element;
  };
  console.log(isAuthenticated);
  
  return (
    <>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
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
