import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import MainPage from "./pages/MainPage";
import ProfilePage from "./pages/ProfilePage";
import RecycleBinPage from "./pages/RecycleBinPage";
import SettingsPage from "./pages/SettingsPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
const currentYear = new Date().getFullYear();

const App = () => {
  return (
    <>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<MainPage />} />
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
