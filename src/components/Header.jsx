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
import { InputAdornment, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice"; // Điều chỉnh theo đường dẫn thực tế

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
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      console.log("Logout");
      dispatch(logoutUser()); // Gọi action để logout
      navigate("/login"); // Điều hướng đến trang đăng nhập
    }
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
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 50,
                  color: "white",
                  "& fieldset": {
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

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => navigate(`/${page.toLowerCase()}`)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
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
    </AppBar>
  );
}
export default Header;
