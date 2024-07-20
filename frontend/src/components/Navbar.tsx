import SearchBar from "./SearchBar";
import { Link  } from "react-router-dom";
import "../assets/Navbar.css";
import axios from "axios";

interface UserDataProps {
  userData: string 
}


const Navbar = ({userData}: UserDataProps) => {   
  // Handle log out
  const handleLogout = async() => {
    try {
      await axios.post("/logout");
      localStorage.removeItem('token');

       window.location.href = "/"
       
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
  <div className="container-fluid" style={{ maxWidth: "1800px" }}>
    <Link to="/home" className="navbar-brand link-unstyled">
      QuikBlok
    </Link>
    
    <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#n_bar" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="n_bar">
        <div className="nav-item flex-grow-1 d-flex justify-content-center">
          <SearchBar />
        </div>
        <div className="nav-item">
          <div className="dropdown">
            <div className="dropdown-toggle welcomeDropdown" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
              Hello, {userData}
            </div>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <Link to="/profile" className="dropdown-item">
                  Profile
                </Link>
              </li>
              <li>
                <button className="dropdown-item text-danger" type="button" data-bs-toggle="modal" data-bs-target="#logoutModal">
                  Log out
                </button>
              </li>
            </ul>
          </div>
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
