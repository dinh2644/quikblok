import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoutes from "./components/PrivateRoutes";
import EmailVerify from "./pages/EmailVerified";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PublicRoutes from "./components/PublicRoutes";
import PageNotFound from "./pages/PageNotFound";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

interface UserData {
  _id: string;
  firstName: string;
  password: string;
  lastName: string;
  email: string;
  username: string;
}

const App = () => {
  const [userData, setUserData] = useState<UserData>({
    _id: "",
    firstName: "",
    password: "",
    lastName: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    const verifyCookie = async () => {
      const { data } = await axios.post(
        "/",
        {},
        { withCredentials: true }
      );

      const { userInfo } = data;

      setUserData(userInfo);
    };
    verifyCookie();
  }, []);

  return (
    <Router>
      <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
      <Routes>

        {/* Accessible through email link only */}
        <Route path="/resetPassword/:token" element={<ResetPassword />}></Route>
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/preverify/:token" element={<EmailVerify />} /> 
        {/* PUBLIC ROUTES */}
        <Route element={<PublicRoutes />}>
          <Route path="/" element={<Register />} />
          <Route path="/Login" element={<Login />} />
         
        </Route>

        {/* PRIVATE ROUTES */}
        <Route element={<PrivateRoutes />}>
          <Route path="/Home" element={<Home userData={userData}/>} />
          <Route
            path="/Profile"
            element={<ProfilePage userData={userData} />}
          />

        </Route>
        {/* Handle Unknown Routes */}
        <Route path="*" element={<PageNotFound />} />

      </Routes>
      
    </Router>
  );
};

export default App;
