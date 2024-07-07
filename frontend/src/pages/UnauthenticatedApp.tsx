import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import EmailVerify from './EmailVerified';
import PageNotFound from './PageNotFound';
import { useAuthContext } from '../hooks/useAuthContext';

const UnauthenticatedApp: React.FC = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate()

    useEffect(()=>{
        navigate("/login")
    },[])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgotPassword" element={<ForgotPassword user={user}/>} />
      <Route path="/resetPassword/:token" element={<ResetPassword />} />
      <Route path="/preverify/:token" element={<EmailVerify user={user}/>} />
      <Route path="*" element={<PageNotFound user={user}/>} />
    </Routes>
  );
};

export default UnauthenticatedApp;