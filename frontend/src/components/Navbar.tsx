import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/Navbar.css";
import React, { useContext } from 'react';
import { SearchValueContext } from '../pages/Home';


interface UserData {
  firstName: string;
}

interface NavbarProps {
  userData: UserData;
}

const Navbar = ({ userData }: NavbarProps) => {
  const { searchValue, setSearchValue } = useContext(SearchValueContext);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

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

          <SearchBar searchValue = {searchValue} handleSearchChange = {handleSearchChange}/>

          <div className="dropdown">
            <div className="dropdown">
              <div
                className="dropdown-toggle welcomeDropdown"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Welcome, {userData.firstName}
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
