import DefaultPFP from "../assets/pfp-default.jpg";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* Logo/Name */}
        <Link to="/" className="navbar-brand link-unstyled">
          QuikBlok
        </Link>

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
            <Link to="/profile" className="dropdown-item link-unstyled">
              Profile
            </Link>
            <Link to="/settings" className="dropdown-item link-unstyled">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
