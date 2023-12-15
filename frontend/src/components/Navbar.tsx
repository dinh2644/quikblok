import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ username }) => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const user = userContext?.user;

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
        <div className="container">
          <Link to="/Home" className="navbar-brand link-unstyled">
            QuikBlok
          </Link>

          <SearchBar />

          {user ? (
            <div className="dropdown">
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Logged in as: {username}
                </button>
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
          ) : (
            <>
              <Link to="/Login" className="navbar-brand link-unstyled">
                Login
              </Link>
              <Link to="/" className="navbar-brand link-unstyled">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
