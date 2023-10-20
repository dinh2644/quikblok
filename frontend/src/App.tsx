import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import RecycleBinPage from "./pages/RecycleBinPage";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const currentYear = new Date().getFullYear();

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bin" element={<RecycleBinPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>

        <Footer year={currentYear} />
      </Router>
    </>
  );
};

export default App;
