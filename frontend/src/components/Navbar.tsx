import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import "../assets/Navbar.css";
import { useState } from "react";

interface UserProps {
 user: string 
 logout: () => void
}


const Navbar = ({user, logout}: UserProps) => { 
  const [firstName ] = useState<string>(user)
  
  // Handle log out
  const handleLogout = () => {
    logout()
  };


  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid" style={{ maxWidth: "1800px" }}>
          <Link to="/" className="navbar-brand link-unstyled">
            QuikBlok
          </Link>

          <div className="searchBar">
          <SearchBar />
          </div>

          <div className="dropdown">
            <div className="dropdown dropDownParent">
              <div
                className="dropdown-toggle welcomeDropdown"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Hello, {firstName}
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
                  <button className="dropdown-item text-danger" type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#logoutModal"
                  >
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      {/* Logout modal */}
      <div
        className="modal fade"
        id="logoutModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content rounded-3 text-center logoutModalShape">
            <div
              className="modal-header border-0 "
              style={{ margin: "0 auto", marginBottom: "-10px" }}
            >
              <h3 className="mt-1">Are you sure you want to log out?</h3>
            </div>
            <div className="modal-body logoutBody">
              <button className="logoutBtn" onClick={handleLogout} data-bs-dismiss="modal">
                Log Out
              </button>
              <button className="cancelBtn" data-bs-dismiss="modal">
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
