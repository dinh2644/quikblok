import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          {/* Logo/Name */}
          <Link to="/Home" className="navbar-brand link-unstyled">
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
              <img src={""} alt="profile dropdown" className="rounded-circle" />
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <Link to="/Login" className="dropdown-item link-unstyled">
                Login
              </Link>
              <Link to="/Register" className="dropdown-item link-unstyled">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
