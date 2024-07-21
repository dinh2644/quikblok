import { useEffect, useState } from 'react';
import {Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import axios from "axios";
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


axios.defaults.baseURL = "http://localhost:8000";
//axios.defaults.baseURL = "https://quikblok.onrender.com";
axios.defaults.withCredentials = true;

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token')
  const [userData, setUserData] = useState<{[key:string]:any}>({
    userInfo:{
      _id: "123",
      firstName: "John",
      password: "password123",
      lastName: "Dinh",
      email: "johndoe@mail.com",
      username: "johnnydoester",

    }
  })
  
  // Fetch user data
  // useEffect(()=>{
  //   const fetchUserData = async()=>{
  //     try {
  //       const {data} = await axios.get("/");
  //       if (data && data.userInfo) {
  //         setUserData(data)
  //       }else if (data.status === false) {
  //         localStorage.removeItem('token');
  //         window.location.href="/"
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  //   if (isAuthenticated) {
  //     fetchUserData();
  //   }
  // },[])


  return (
    <>
      <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
      <Routes>       

        <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/home"/>} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <PageNotFound isAuthenticated={isAuthenticated}/>} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage userData={userData?.userInfo} /> : <PageNotFound isAuthenticated={isAuthenticated}/>} />
        <Route path='/home' element={isAuthenticated ? <Home userData={userData?.userInfo?.firstName}/> : <Navigate to="/"/>} />

        <Route path="*" element={<PageNotFound isAuthenticated={isAuthenticated} />} />
        <Route path="/forgotPassword" element={<ForgotPassword isAuthenticated={isAuthenticated} />} />
        <Route path="/resetPassword/:token" element={<ResetPassword isAuthenticated={isAuthenticated} />} />
        <Route path="/preverify/:token" element={<EmailVerify  isAuthenticated={isAuthenticated}/>} />

      </Routes>
    </>
   
  );
};

export default App;
