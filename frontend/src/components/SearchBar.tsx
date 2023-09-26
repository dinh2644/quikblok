import { useState } from "react";

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <>
      <form className="d-flex">
        <input
          className="form-control me-2"
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
