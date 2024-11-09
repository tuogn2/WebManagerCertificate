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
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import logo from "../assets/logo.png";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [isResetButtonEnabled, setIsResetButtonEnabled] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [retypePasswordError, setRetypePasswordError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const token = localStorage.getItem("token");
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

    // Set validation messages for each input
    setNewPasswordError("");
    setRetypePasswordError("");
    if (!newPassword) {
      setNewPasswordError("Password cannot be empty.");
    } else if (!passwordRegex.test(newPassword)) {
      setNewPasswordError(
        "Password must be at least 8 characters long, include one uppercase letter, one special character, and one number."
      );
    }
    if (newPassword !== retypePassword && retypePassword) {
      setRetypePasswordError("Passwords do not match.");
    }
  }, [newPassword, retypePassword]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/getuserbyemail/${email}`
      );
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      setSnackbarMessage("Error fetching user. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return null;
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    let currentUser = user;
    if (currentUser === null) {
      currentUser = await fetchUser();
    }

    if (currentUser) {
      try {
        const userId = currentUser._id || currentUser.id;
        console.log("User ID:", userId);
        console.log("Token:", token);

        const response = await axios.put(
          `${API_BASE_URL}/users/forgotpassword/${userId}`,
          { newPassword },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setSnackbarMessage("Password changed successfully!");
          setSnackbarSeverity("success");
          dispatch(logoutUser());
          localStorage.removeItem("walletAddress");
          localStorage.removeItem("balance");
          navigate("/login");
        } else {
          setSnackbarMessage("Error changing password. Please try again.");
          setSnackbarSeverity("error");
        }
      } catch (error) {
        setSnackbarMessage("Error changing password. Please try again.");
        setSnackbarSeverity("error");
      } finally {
        setSnackbarOpen(true);
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
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
          background: "linear-gradient(135deg, #1e90ff 30%, #00bfff 90%)",
          maxWidth: '500px', // Restrict container width
          px: 4, // Padding for better responsiveness
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: '100%',
            maxWidth: '450px', // Fixed width for the Paper component
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Enhanced shadow
          }}
        >
          <IconButton
            sx={{ position: "absolute", top: 16, left: 16 }}
            onClick={() => navigate("/forgot-password")}
          >
            <ArrowBackIcon />
          </IconButton>

          <Box mb={2}>
            <img
              src={logo}
              alt="Logo"
              style={{ borderRadius: "5%", width: 50, height: 50 }}
            />
          </Box>

          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            Change password
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Enter your new password to access your courses and certificates.
          </Typography>

          <TextField
            fullWidth
            placeholder="New password"
            variant="outlined"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={!!newPasswordError}
          />
          {newPasswordError && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {newPasswordError}
            </Typography>
          )}

          <TextField
            label="Retype new password"
            variant="outlined"
            type="password"
            fullWidth
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.target.value)}
            error={!!retypePasswordError}
            sx={{ mt: 2 }}
          />
          {retypePasswordError && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {retypePasswordError}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleChangePassword}
            disabled={!isResetButtonEnabled}
            sx={{
              borderRadius: 20,
              backgroundColor: "#00c4cc",
              "&:hover": { backgroundColor: "#00b0b6" },
            }}
          >
            Change Password
          </Button>
        </Paper>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChangePassword;
