import { useState } from "react";
import { MdSearch } from "react-icons/md";

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form className="search" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search Product"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">
        <MdSearch></MdSearch>
      </button>
    </form>
  );
};

export default Search;
