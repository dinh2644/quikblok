import { useState } from "react";
import "../assets/Navbar.css";

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <>
      <form className="d-flex" style={{ width: "15rem" }}>
        <input
          className="form-control"
          id="hello"
          type="search"
          placeholder="Search"
          aria-label="Search"
          onChange={(event) => setSearchInput(event.target.value)}
          value={searchInput}
        />
      </form>
    </>
  );
};

export default SearchBar;
