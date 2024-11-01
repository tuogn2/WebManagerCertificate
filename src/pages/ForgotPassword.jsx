import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  CssBaseline,
  Snackbar,
  Alert,
} from "@mui/material";
import { Close, Email } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import logo from "../assets/logo.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailToSend = queryParams.get("email");
  const [emailNew, setEmailNew] = useState("");

  const [verificationCode, setVerificationCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const token = localStorage.getItem("token");

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [notification, setNotification] = useState("");
  const [isResetButtonEnabled, setIsResetButtonEnabled] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setIsButtonDisabled(false);
    }

    // Enable the reset button only if the entered code is 6 digits long
    setIsResetButtonEnabled(enteredCode.length === 6);

    return () => clearTimeout(timer);
  }, [countdown, enteredCode]);

  const handleSendCodeEmail = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/send-code`,
        { email: emailToSend || emailNew },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Corrected template literal
          },
        }
      );
      setVerificationCode(response.data.code); // Assuming the server returns the code in response.data.code
      console.log("Token: ", token);
      console.log("Verification code sent:", response.data.code);
      setSnackbarMessage("Verification code sent successfully!");
      setSnackbarSeverity("success");
    } catch (err) {
      console.error("Error sending verification code:", err);
      setSnackbarMessage("Error sending verification code.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleClickSentCode = () => {
    setIsButtonDisabled(true);
    setCountdown(60);
    handleSendCodeEmail();
  };

  const handleVerifyCode = () => {
    console.log("Entered code:", enteredCode);
    console.log("Verification code:", verificationCode);
    if (enteredCode == verificationCode) {
      setNotification("Verification code is correct!");
      // Redirect to the reset password page
      navigate(
        `/change-password?email=${encodeURIComponent(emailToSend || emailNew)}`
      );
    } else {
      setNotification("Verification code is incorrect. Please try again.");
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
            onClick={() => navigate("/account-settings")}
          >
            <ArrowBackIcon />
          </IconButton>

          {/* Close Button */}
          <IconButton
            sx={{ position: "absolute", top: 16, right: 16 }}
            onClick={() => navigate("/")}
          >
            <Close />
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
            Forgot password?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Enter your email or username, and we will send you a password
            recovery code.
          </Typography>

          {/* Email Input */}
          <TextField
            fullWidth
            placeholder="Email"
            variant="outlined"
            value={token ? emailToSend : emailNew}
            disabled={token ? true : false}
            onChange={(e) => setEmailNew(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
          />

          {/* Message */}
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            To get the password recovery code, please click "Send Code".
          </Typography>

          {/* Buttons */}
          <Box display="flex" justifyContent="space-between" mb={2}>
            <TextField
              label="Enter verification code"
              variant="outlined"
              type="number"
              disabled={false}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={handleClickSentCode}
                      disabled={isButtonDisabled}
                      title="Send code"
                    >
                      {isButtonDisabled
                        ? `Resend in ${countdown}s`
                        : "Send Code"}
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{ width: "100%" }}
              onChange={(e) => setEnteredCode(e.target.value)}
              value={enteredCode}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleVerifyCode}
            disabled={!isResetButtonEnabled}
            sx={{
              borderRadius: 20,
              backgroundColor: "#00c4cc",
              "&:hover": { backgroundColor: "#00b0b6" },
            }}
          >
            Verify Code
          </Button>

          {/* Notification */}
          {notification && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {notification}
            </Typography>
          )}
        </Paper>
      </Container>

      {/* Snackbar */}
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

export default ForgotPassword;
