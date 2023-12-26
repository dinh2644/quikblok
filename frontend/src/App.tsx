import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import RecycleBinPage from "./pages/RecycleBinPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoutes from "./components/PrivateRoutes";
import EmailVerify from "./pages/EmailVerified";

const currentYear = new Date().getFullYear();

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

const App = () => {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    const verifyCookie = async () => {
      const { data } = await axios.post(
        "http://localhost:8000",
        {},
        { withCredentials: true }
      );
      const { user, id } = data;
      setUsername(user);
      setId(id);
    };
    verifyCookie();
  }, []);

  return (
    <Router>
      <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/verify/:token" element={<EmailVerify />} />

        <Route element={<PrivateRoutes username={username} />}>
          <Route path="/Home" element={<Home />} />
          <Route path="/Profile" element={<ProfilePage id={id} />} />
          <Route path="/Bin" element={<RecycleBinPage />} />{" "}
        </Route>
      </Routes>
      <Footer year={currentYear} />
    </Router>
  );
};

export default App;
