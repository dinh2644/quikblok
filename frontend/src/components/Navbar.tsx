import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/Navbar.css";

interface usernameProp {
  username: string;
}

const Navbar = ({ username }: usernameProp) => {
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/logout",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/");
        console.log("Logged out successfully");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container" style={{ maxWidth: "1800px" }}>
          <Link to="/Home" className="navbar-brand link-unstyled">
            QuikBlok
          </Link>

          <SearchBar />

          <div className="dropdown">
            <div className="dropdown">
              <div
                className="dropdown-toggle welcomeDropdown"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Welcome, {username}
              </div>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <Link to="/Profile" className="dropdown-item">
                    Profile
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
