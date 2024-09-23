import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import SearchIcon from "@mui/icons-material/Search";
import {
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Web3 from "web3";
import { useRef, useState } from "react";
import {
  setWalletAddress,
  setBalance,
  clearWallet,
} from "../store/slices/walletSlice";

import { API_BASE_URL } from "../utils/constants.jsx";
import { useEffect } from "react";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const settings = [
  "My Learning",
  "Profile",
  "Setting",
  "Accomplishments",
  "Help Center",
  "Logout",
];

function Header() {
  const user = useSelector((state) => state.auth.user);
  // <<<<<<< HEAD
  // Control search suggestions visibility

  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("info");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const searchRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const walletAddress = useSelector((state) => state.wallet.address);
  const balance = useSelector((state) => state.wallet.balance);
  const { avt } = useSelector((state) => state.auth.user);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (setting) => {
    if (setting === "Profile") {
      navigate("/my-profile");
    } else if (setting === "Setting") {
      navigate("/account-settings");
    } else if (setting === "My Learning") {
      navigate("/my-learning");
    } else if (setting === "Accomplishments") {
      navigate("/accomplishments");
    } else if (setting === "Logout") {
      dispatch(logoutUser());
      dispatch(clearWallet());
      navigate("/login");
    }
  };

  const popularSearches = [
    "Javascript for beginners",
    "English for career development",
    "Become a data analyst",
  ];

  const handleSearchChange = async (event) => {
    const query = event.target.value;
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
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchBlur = (event) => {
    if (!searchRef.current?.contains(event.relatedTarget)) {
      setShowSuggestions(false);
    }
  };

  const connectMetaMask = async () => {
    if (typeof window.ethereum === "undefined") {
      setSnackbarMessage(
        "MetaMask không được cài đặt. Vui lòng cài đặt MetaMask để tiếp tục."
      );
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const accountAddress = accounts[0];
      dispatch(setWalletAddress(accountAddress));
      setSnackbarMessage("Kết nối MetaMask thành công.");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      fetchBalance(accountAddress);
    } catch (error) {
      console.error("Không thể kết nối với MetaMask:", error);
      setSnackbarMessage("Không thể kết nối với MetaMask.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async (accountAddress) => {
    try {
      const web3 = new Web3(window.ethereum);
      const balanceInWei = await web3.eth.getBalance(accountAddress);
      const balanceInEth = web3.utils.fromWei(balanceInWei, "ether");
      dispatch(setBalance(balanceInEth));
    } catch (error) {
      console.error("Không thể lấy số dư MetaMask:", error);
    }
  };

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      const newAccount = accounts[0];
      dispatch(setWalletAddress(newAccount));
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [dispatch]);

  useEffect(() => {
    if (walletAddress) {
      fetchBalance(walletAddress);
    }
  }, [walletAddress]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box flex={1}>
            <Box
              display={"flex"}
              sx={{ width: "auto", alignItems: "center" }}
              onClick={() => navigate("/")}
            >
              <img
                src={logo}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  paddingRight: 5,
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
              />
              <Typography sx={{ cursor: "pointer" }}>M-Certificate</Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 2, position: "relative" }}>
            <TextField
              placeholder="What do you want to learn?"
              variant="outlined"
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              onChange={handleSearchChange}
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
                    <IconButton color="info">
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
                }}
                onBlur={handleSearchBlur}
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
                        : "Search Results"}
                    </ListSubheader>
                  }
                >
                  {searchError ? (
                    <ListItem>
                      <ListItemText primary={searchError} />
                    </ListItem>
                  ) : (
                    searchResults.map((course) => (
                      <ListItemButton
                        key={course._id}
                        alignItems="center"
                        onClick={() => navigate(`/course/${course._id}`)}
                      >
                        <ListItemAvatar>
                          <Avatar src={course.image} />
                        </ListItemAvatar>
                        <ListItemText primary={course.title} />
                      </ListItemButton>
                    ))
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
                        Popular Right Now
                      </ListSubheader>
                    }
                  >
                    {popularSearches.map((search, index) => (
                      <ListItemButton button key={index} tabIndex={0}>
                        <SearchIcon sx={{ mr: 2 }} />
                        <ListItemText primary={search} />
                      </ListItemButton>
                    ))}
                  </List>
                </List>
              </Paper>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            {walletAddress ? (
              <>
                <Typography variant="body1" sx={{ color: "white", mr: 1 }}>
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </Typography>
                <Typography variant="body1" sx={{ color: "white", mr: 2 }}>
                  {balance ? `${balance} ETH` : "Đang tải..."}
                </Typography>
              </>
            ) : (
              <Button
                variant="outlined"
                color="inherit"
                onClick={connectMetaMask}
                disabled={loading}
              >
                {loading ? "Connecting..." : "Connect MetaMask"}
              </Button>
            )}
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ marginLeft: "10px" }} src={avt} alt={"avt"} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleMenuItemClick(setting)}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppBar>
  );
}

export default Header;
