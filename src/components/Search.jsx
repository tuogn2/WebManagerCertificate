import React, { useRef, useState, useEffect } from "react";
import {
  TextField,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Avatar,
  ListItemAvatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants.jsx";

function Search() {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState({
    courses: [],
    bundles: [],
  });
  const [searchError, setSearchError] = useState(null);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Hook để lấy URL hiện tại

  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const storedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(storedSearches);

    // Cập nhật `query` từ tham số URL (nếu có)
    const urlParams = new URLSearchParams(location.search);
    const queryFromURL = urlParams.get("query");
    if (queryFromURL) {
      setQuery(queryFromURL);
    }
  }, [location.search]);

  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setQuery(query);
    if (query.trim()) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/course/search?query=${encodeURIComponent(query)}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSearchResults(data);
        setSearchError(null);
      } catch (error) {
        console.error("Error searching courses:", error);
        setSearchError("Error fetching search results");
        setSearchResults({ courses: [], bundles: [] });
      }
    } else {
      setSearchResults({ courses: [], bundles: [] });
    }
  };

  const handleSearchClick = () => {
    if (query.trim()) {
      // Check if the query already exists in recentSearches
      let updatedSearches = recentSearches.filter((search) => search !== query);

      // Add the query to the top of the list
      updatedSearches = [query, ...updatedSearches].slice(0, 3);

      // Save the updated searches to localStorage
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      setRecentSearches(updatedSearches);

      // Navigate to the search page
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleRecentSearchClick = (search) => {
    setQuery(search); // Set the query to the selected recent search
    navigate(`/search?query=${encodeURIComponent(search)}`); // Navigate to the search page with the selected search query
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchClick(); // Trigger the search when "Enter" is pressed
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <TextField
        placeholder="What do you want to learn?"
        autoComplete="off"
        variant="outlined"
        value={query} // Hiển thị giá trị query trong thanh tìm kiếm
        onFocus={() => setShowSuggestions(true)}
        onBlur={(event) => {
          if (!searchRef.current?.contains(event.relatedTarget)) {
            setShowSuggestions(false);
          }
        }}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown} // Add keydown event listener here
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 50,
            color: "white",
            "& fieldset": {
              borderColor: "white",
            },
            "&:hover fieldset": {
              borderColor: "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton color="info" onClick={handleSearchClick}>
                <SearchIcon style={{ color: "#fff" }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {showSuggestions && (
        <Paper
          ref={searchRef}
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            borderRadius: "10px",
            padding: "10px",
            boxShadow: 3,
            maxHeight: 400, 
            overflowY: 'auto', 
          }}
          tabIndex={-1}
        >
          <List
            subheader={
              <ListSubheader
                component="div"
                sx={{
                  userSelect: "none",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                {searchError
                  ? "Error fetching search results"
                  : ""}
              </ListSubheader>
            }
          >
            {searchError ? (
              <ListItemButton>
                <ListItemText primary={searchError} />
              </ListItemButton>
            ) : (
              <>
                {searchResults.courses.map((course) => (
                  <ListItemButton
                    sx={{
                      userSelect: "none",
                      color: "black",
                      fontWeight: "bold",
                    }}
                    key={course._id}
                    alignItems="center"
                    onClick={() => {
                      navigate(`/course/${course._id}`);
                      setShowSuggestions(false);
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={course.image} />
                    </ListItemAvatar>
                    <ListItemText primary={course.title} />
                  </ListItemButton>
                ))}
                {searchResults.bundles.map((bundle) => (
                  <ListItemButton
                    sx={{
                      userSelect: "none",
                      color: "black",
                      fontWeight: "bold",
                    }}
                    key={bundle._id}
                    alignItems="center"
                    onClick={() => {
                      navigate(`/bundle/${bundle._id}`);
                      setShowSuggestions(false);
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={bundle.image} />
                    </ListItemAvatar>
                    <ListItemText primary={bundle.title} />
                  </ListItemButton>
                ))}
              </>
            )}
            <List
              subheader={
                <ListSubheader
                  component="div"
                  sx={{
                    userSelect: "none",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  Recent Searches
                </ListSubheader>
              }
            >
              {recentSearches.map((search, index) => (
                <ListItemButton
                  button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)} // Call the new function when clicked
                >
                  <SearchIcon sx={{ mr: 2 }} />
                  <ListItemText primary={search} />
                </ListItemButton>
              ))}
            </List>
          </List>
        </Paper>
      )}
    </div>
  );
}

export default Search;
