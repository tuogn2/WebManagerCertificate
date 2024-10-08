import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Divider,
  IconButton,
  CssBaseline,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [isResetButtonEnabled, setIsResetButtonEnabled] = useState(false);
  const [notification, setNotification] = useState("");
  const navigate = useNavigate(); // Correctly use the useNavigate hook
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // Enable the reset button only if both passwords match, are not empty, and meet the regex requirements
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const isValid =
      newPassword &&
      retypePassword &&
      passwordRegex.test(newPassword) &&
      newPassword === retypePassword;
    setIsResetButtonEnabled(isValid);

    if (!newPassword || !retypePassword) {
      setNotification("Password fields cannot be empty.");
    } else if (!passwordRegex.test(newPassword)) {
      setNotification(
        "Password must be at least 8 characters long, include one uppercase letter, one special character, and one number."
      );
    } else if (newPassword !== retypePassword) {
      setNotification("Passwords do not match.");
    } else {
      setNotification("");
    }
  }, [newPassword, retypePassword]);
  const token = localStorage.getItem('token');
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/forgotpassword/${user._id === undefined ? user.id : user._id}`,
        {
          newPassword,
        }, {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào headers
          },}
      );
      if (response.status === 200) {
        console.log("Password changed successfully:", response.data);
        setNotification("Password changed successfully!");
        dispatch(logoutUser());
        localStorage.removeItem("walletAddress");
        localStorage.removeItem("balance");
        navigate("/login");
      } else {
        setNotification("Error changing password. Please try again.");
        console.error("Error changing password:", error);
      }
    } catch (error) {
      setNotification("Error changing password. Please try again.");
      console.error("Error changing password:", error);
    }
  };

  return (
    <>
      <CssBaseline />
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, highlight 30%, blue 90%)",
        }}
      >
        <Paper
          elevation={6}
          sx={{ p: 4, borderRadius: 4, textAlign: "center" }}
        >
          {/* Back Button */}
          <IconButton
            sx={{ position: "absolute", top: 16, left: 16 }}
            onClick={() => navigate("/forgot-password")}
          >
            <ArrowBackIcon />
          </IconButton>

          {/* Logo */}
          <Box mb={2}>
            <img
              src={logo} // Replace with your logo URL
              alt="Logo"
              style={{ borderRadius: "5%", width: 50, height: 50 }}
            />
          </Box>

          {/* Title */}
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            Change password
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Enter your new password to access your courses and certificates.
          </Typography>

          {/* Password Fields */}
          <form onSubmit={handleChangePassword}>
            {/* New password Input */}
            <TextField
              fullWidth
              placeholder="New password"
              variant="outlined"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            {/* Retype new password */}
            <TextField
              label="Retype new password"
              variant="outlined"
              type="password"
              fullWidth
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              sx={{ mt: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            <Button
              variant="contained"
              color="success"
              fullWidth
              // onClick={handleChangePassword}
              disabled={!isResetButtonEnabled}
              type="submit"
              sx={{
                borderRadius: 20,
                backgroundColor: "#00c4cc",
                "&:hover": { backgroundColor: "#00b0b6" },
              }}
            >
              Change Password
            </Button>
          </form>

          {/* Notification */}
          {notification && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {notification}
            </Typography>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default ChangePassword;
