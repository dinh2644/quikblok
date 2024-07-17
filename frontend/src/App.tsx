import React, { ReactElement } from 'react';
import {Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import axios from "axios";
import useAuth from './hooks/useAuth';
// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EmailVerify from './pages/EmailVerified';
import PageNotFound from './pages/PageNotFound';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import Loading from './components/Loading';


//axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.baseURL = "https://quikblok.onrender.com";
axios.defaults.withCredentials = true;

interface RouteProps {
  element: ReactElement;
}

const App = () => {
  const {isAuthenticated, user, loading} = useAuth();

  if(loading){
    return <Loading/>
  }

  const PrivateRoute: React.FC<RouteProps> = ({ element }) => {
    return isAuthenticated ? element : <PageNotFound isAuthenticated={isAuthenticated}/>;
  };
  const InvalidIfAuthenticated: React.FC<RouteProps> = ({ element }) => {
    return isAuthenticated ? <PageNotFound isAuthenticated={isAuthenticated}/> : element;
  };
  
  return (
    <>
      <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<InvalidIfAuthenticated element={<Login />} />} />
        <Route path="/register" element={<InvalidIfAuthenticated element={<Register />} />} />

        {/* Protected routes */}
        <Route path="/" element={<PrivateRoute element={<Home user={user.userInfo.firstName} />} />} />
        <Route path="/profile" element={<PrivateRoute element={<ProfilePage userData={user.userInfo} />} />} />

        {/* Other routes */}
        <Route path="*" element={<PageNotFound isAuthenticated={isAuthenticated} />} />
        <Route path="/forgotPassword" element={<ForgotPassword isAuthenticated={isAuthenticated} />} />
        <Route path="/resetPassword/:token" element={<ResetPassword isAuthenticated={isAuthenticated} />} />
        <Route path="/preverify/:token" element={<EmailVerify  isAuthenticated={isAuthenticated}/>} />
      </Routes>
    </>
   
  );
};

export default App;
