import DefaultPFP from "../assets/pfp-default.jpg";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* Logo/Name */}
        <a className="navbar-brand">
          <Link to="/" className="link-unstyled">
            QuikBlok
          </Link>
        </a>

        <SearchBar />

        {/* Signed In Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {/* Empty Profile Picture */}
            <img
              src={DefaultPFP}
              alt="Profile"
              className="rounded-circle"
              style={{ width: "32px", height: "32px" }}
            />
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a className="dropdown-item">
              <Link to="/profile" className="link-unstyled">
                Profile
              </Link>
            </a>
            <a className="dropdown-item">
              <Link to="/settings" className="link-unstyled">
                Settings
              </Link>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
