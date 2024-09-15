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

import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Web3 from "web3";
import { useRef, useState } from "react";
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const pages = [];
const settings = [
  "My Courses",
  "Profile",
  "My Purchases",
  "Setting",
  "Accomplishments",
  "Help Center",
  "Logout",
];

function Header() {
  // <<<<<<< HEAD
  // Control search suggestions visibility
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  // =======
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [balance, setBalance] = React.useState(
    localStorage.getItem("balance") || null
  );
  const [loading, setLoading] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [snackbarSeverity, setSnackbarSeverity] = React.useState("info");
  const [walletAddress, setWalletAddress] = React.useState(
    localStorage.getItem("walletAddress") || null
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const courses = useSelector((state) => state.courses.courses);

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
    } else if (setting === "Logout") {
      dispatch(logoutUser());
      localStorage.removeItem("walletAddress");
      localStorage.removeItem("balance");
      navigate("/login");
    }
  };

  // <<<<<<< HEAD
  const popularSearches = [
    "Javascript for beginners",
    "english for career development",
    "Become a data analyst",
  ];

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchBlur = (event) => {
    // Check if the next focus target is within the suggestions list
    if (!searchRef.current?.contains(event.relatedTarget)) {
      setShowSuggestions(false);
    }
  };

  // =======
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
      setWalletAddress(accountAddress);
      localStorage.setItem("walletAddress", accountAddress);
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
      setBalance(balanceInEth);
      localStorage.setItem("balance", balanceInEth);
    } catch (error) {
      console.error("Không thể lấy số dư MetaMask:", error);
    }
  };

  React.useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      const newAccount = accounts[0];
      setWalletAddress(newAccount);
      localStorage.setItem("walletAddress", newAccount);
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
  }, []);

  React.useEffect(() => {
    if (walletAddress) {
      fetchBalance(walletAddress);
    }
  }, [walletAddress]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box flex={1}>
            <Box
              display={"flex"}
              sx={{ width: "auto", alignItems: "center" }}
              onClick={() => navigate("/")}
            >
              <AdbIcon sx={{ cursor: "pointer" }} />
              <Typography sx={{ cursor: "pointer" }}>M-Certificate</Typography>
            </Box>
          </Box>

          <Box flex={1}>
            <TextField
              placeholder="What do you want to learn?"
              variant="outlined"
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
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
          </Box>

          {/* Search Suggestions */}
          {showSuggestions && (
            <Paper
              ref={searchRef}
              sx={{
                position: "absolute",
                top: 62, // Adjust to match the height of your TextField
                left: "30%",
                right: "34%",
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
                    Most Popular Specializations
                  </ListSubheader>
                }
              >
                {courses.map((course) => (
                  <ListItemButton
                    alignItems="center"
                    onClick={() => navigate(`/course/${course._id}`)}
                  >
                    <ListItemAvatar>
                      <Avatar src={course.image} />
                    </ListItemAvatar>
                    <ListItemText primary={course.title} />
                  </ListItemButton>
                ))}
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

          {/* <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => navigate(`/${page.toLowerCase()}`)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box> */}

          <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
            {walletAddress ? (
              <>
                <Typography
                  variant="body1"
                  sx={{ color: "white", marginRight: "5px" }}
                >
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "white", marginRight: 2 }}
                >
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
                <Avatar />
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
