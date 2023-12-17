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
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

const currentYear = new Date().getFullYear();

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <Router>
      <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/bin" element={<RecycleBinPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <Footer year={currentYear} />
    </Router>
  );
};

export default App;
