import { Box, Container, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const SearchBar = ({ setSearchKeyword, setSearchResults }) => {
  const [searchText, setSearchText] = useState("");

  const handleChange = (event) => {
    setSearchText(event.target.value);
    setSearchKeyword(event.target.value);
  };

  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/search`,
        { params: { kwd: searchText } }
      );
      setSearchResults(response.data);
      console.log("Search results:", response.data);
    } catch (error) {
      console.log("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    if (searchText) {
      fetchSearchResults();
    } else {
      setSearchKeyword(""); // Clear the search keyword when the search bar is empty
      setSearchResults([]); // Clear the search results when the search bar is empty
    }
  }, [searchText]);
  return (
    <Box maxWidth="sm" sx={{ mt: 20 }}>
      <TextField
        id="search"
        placeholder="Search"
        value={searchText}
        onChange={handleChange}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchText ? (
            <InputAdornment position="end">
              <CloseIcon cursor="pointer" onClick={() => setSearchText("")} />
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  );
};

export default SearchBar;
