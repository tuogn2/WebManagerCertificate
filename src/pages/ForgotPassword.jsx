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
} from "@mui/material";
import { Close, Email } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import logo from "../assets/logo.png";
import CloseIcon from "@mui/icons-material/Close";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  //   const email = queryParams.get("email");
  const email = "tranhuy12072003@gmail.com";

  const [verificationCode, setVerificationCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");

  const handleSendCode = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/send-code`, {
        email,
      });
      setVerificationCode(response.data.code); // Assuming the server returns the code in response.data.code
      console.log("Verification code sent:", response.data.code);
    } catch (err) {
      console.error("Error sending verification code:", err);
    }
  };

  // Handle sending the verification code
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [notification, setNotification] = useState("");
  const [isResetButtonEnabled, setIsResetButtonEnabled] = useState(false);

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

  const handleClickSentCode = () => {
    setIsButtonDisabled(true);
    setCountdown(60); // 60 seconds countdown
    handleSendCode();
  };

  const handleVerifyCode = () => {
    console.log("Entered code:", enteredCode);
    console.log("Verification code:", verificationCode);
    if (enteredCode == verificationCode) {
      setNotification("Verification code is correct!");
      // Redirect to the reset password page
      navigate("/change-password");
    } else {
      setNotification("Verification code is incorrect. Please try again.");
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
            onClick={() => navigate("/account-settings")}
          >
            <ArrowBackIcon />
          </IconButton>

          {/* Back Button */}
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
            placeholder="Username or Email"
            variant="outlined"
            value={email === undefined ? "" : email}
            disabled
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
    </>
  );
};

export default ForgotPassword;
