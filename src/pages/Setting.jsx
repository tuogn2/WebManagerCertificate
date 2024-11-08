import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Grid,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { logoutUser } from "../store/slices/authSlice";

const Setting = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  // Password handler
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  // Regex for password validation (minimum 8 characters, at least one uppercase, one lowercase, and one number)
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    // Check if the new password is valid using the regex
    setIsPasswordValid(passwordRegex.test(newPassword));

    // Check if the new password and retype password match
    setIsPasswordMatch(newPassword === retypePassword);
  }, [newPassword, retypePassword]);

  const [selectedSection, setSelectedSection] = useState(
    "Password and Security"
  );

  // Function to handle password change
  const changePasswordHandler = async () => {
    if (!isPasswordValid || !isPasswordMatch) {
      alert("Password is invalid or does not match.");
      return;
    }
    const token = localStorage.getItem("token");

    const payload = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/change-password/${user._id === undefined ? user.id : user._id}`,
        payload,
        { headers: headers }
      );

      if (response.status === 200) {
        alert("Password changed successfully");
      } else {
        alert("Failed to change password");
      }
    } catch (error) {
      console.error(error);
      alert(error.response.data.message);
    }
  };

  const handleListItemClick = (section) => {
    setSelectedSection(section);
  };
  const token = localStorage.getItem("token");
  // Function to handle account deletion
  const handleCloseAccount = async () => {
    const data = await axios.delete(`${API_BASE_URL}/users/${user._id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    });
    if (data.status === 200) {
      alert("Account deleted successfully");
      dispatch(logoutUser());
      dispatch(clearWallet());
      navigate("/login");
    } else {
      alert("Failed to delete account");
    }
  };

  // Define the ForgotPassword function
  const ForgotPassword = (email) => {
    return `/forgot-password?email=${encodeURIComponent(email)}`;
  };

  // Component to render the content based on the selected section
  const renderContent = () => {
    switch (selectedSection) {
      case "Password and Security":
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, color: "Highlight" }}>
              Password
            </Typography>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              sx={{ mb: 2 }}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              sx={{ mb: 2 }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={!isPasswordValid && newPassword !== ""}
              helperText={
                !isPasswordValid && newPassword !== ""
                  ? "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
                  : ""
              }
            />
            <TextField
              fullWidth
              label="Retype New Password"
              type="password"
              sx={{ mb: 2 }}
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              error={!isPasswordMatch && retypePassword !== ""}
              helperText={
                !isPasswordMatch && retypePassword !== ""
                  ? "Passwords do not match."
                  : ""
              }
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                disabled={!isPasswordValid || !isPasswordMatch}
                onClick={changePasswordHandler}
              >
                Change Password
              </Button>
              <Typography variant="body2" sx={{ mt: 2 }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate(ForgotPassword(user.email))}
                >
                  Forgot Password?
                </Link>
              </Typography>
            </Box>
            {/* <Typography variant="h5" sx={{ color: "Highlight", mt: 2, mb: 2 }}>
              Security
            </Typography> */}
          </Box>
        );
      case "Billing and Payments":
        return (
          <Box>
            <Typography variant="h6">Billing and Payments</Typography>
            <Typography variant="body2" color="textSecondary">
              View your billing history and manage payment methods.
            </Typography>
            {/* Add billing and payments details here */}
          </Box>
        );
      case "Close Account":
        return (
          <Box sx={{ p: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" color="error">
              <Typography sx={{ fontWeight: 800 }}> Warning:</Typography> If you
              close your account, you will be unsubscribed from all of your
              courses and will lose access to your account and data associated
              with your account forever, even if you choose to create a new
              account using the same email address in the future.
            </Typography>
            <Button
              variant="contained"
              color="error"
              sx={{ mt: 2 }}
              onClick={handleCloseAccount}
            >
              Delete Account
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        <Box mt={3}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "Highlight",
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            Settings
          </Typography>
        </Box>
        <Container maxWidth={"lg"} sx={{ mt: 2 }}>
          <Grid container spacing={10}>
            {/* Left Section: Settings List */}
            <Grid item xs={12} md={4}>
              <Paper elevation={5}>
                <Divider sx={{ mb: 2 }} />
                <List component="nav">
                  <ListItemButton
                    onClick={() => handleListItemClick("Password and Security")}
                    sx={{
                      backgroundColor:
                        selectedSection === "Password and Security"
                          ? "Highlight"
                          : "transparent",
                      "&:hover": {
                        backgroundColor: "Highlight",
                        color: "white",
                        "& .MuiSvgIcon-root": {
                          color: "white",
                        },
                        "& .MuiListItemText-root": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemIcon>
                      <LockIcon
                        sx={{
                          color:
                            selectedSection === "Password and Security"
                              ? "WHITE"
                              : "inherit",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Password and Security"
                      sx={{
                        color:
                          selectedSection === "Password and Security"
                            ? "WHITE"
                            : "BLACK",
                      }}
                    />
                  </ListItemButton>
                  {/* <ListItemButton
                    onClick={() => handleListItemClick("Billing and Payments")}
                    sx={{
                      backgroundColor:
                        selectedSection === "Billing and Payments"
                          ? "Highlight"
                          : "transparent",
                      "&:hover": {
                        backgroundColor: "Highlight",
                        color: "white",
                        "& .MuiSvgIcon-root": {
                          color: "white",
                        },
                        "& .MuiListItemText-root": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemIcon>
                      <PaymentIcon
                        sx={{
                          color:
                            selectedSection === "Billing and Payments"
                              ? "WHITE"
                              : "inherit",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Billing and Payments"
                      sx={{
                        color:
                          selectedSection === "Billing and Payments"
                            ? "WHITE"
                            : "BLACK",
                      }}
                    />
                  </ListItemButton> */}
                  <ListItemButton
                    onClick={() => handleListItemClick("Close Account")}
                    sx={{
                      backgroundColor:
                        selectedSection === "Close Account"
                          ? "Highlight"
                          : "transparent",
                      "&:hover": {
                        backgroundColor: "Highlight",
                        color: "white",
                        "& .MuiSvgIcon-root": {
                          color: "white",
                        },
                        "& .MuiListItemText-root": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemIcon>
                      <DeleteIcon
                        sx={{
                          color:
                            selectedSection === "Close Account"
                              ? "WHITE"
                              : "inherit",
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Close Account"
                      sx={{
                        color:
                          selectedSection === "Close Account"
                            ? "WHITE"
                            : "BLACK",
                      }}
                    />
                  </ListItemButton>
                </List>
              </Paper>
            </Grid>

            {/* Right Section: Settings Content */}
            <Grid item xs={12} md={8}>
              <Paper elevation={5} sx={{ p: 3, minHeight: "300px" }}>
                {renderContent()}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Container>
      <Footer />
    </>
  );
};

export default Setting;
