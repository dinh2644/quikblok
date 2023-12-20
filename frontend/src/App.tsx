import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import RecycleBinPage from "./pages/RecycleBinPage";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useCookies } from "react-cookie";
import Navbar from "./components/Navbar";

const currentYear = new Date().getFullYear();

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

const App = () => {
  const [cookies, removeCookie] = useCookies(["token"]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const verifyCookie = async () => {
      const { data } = await axios.post(
        "http://localhost:8000",
        {},
        { withCredentials: true }
      );
      const { user } = data;
      setUsername(user);
    };
    verifyCookie();
  }, [cookies, removeCookie]);

  return (
    <Router>
      <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route
          element={
            <>
              <Navbar username={username} />
              <Outlet />
            </>
          }
        >
          <Route path="/Home" element={<Home username={username} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bin" element={<RecycleBinPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      <Footer year={currentYear} />
    </Router>
  );
};

export default App;
