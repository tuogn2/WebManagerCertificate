import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Divider,
  IconButton,
  Link,
  Box,
  Typography,
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import { API_BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { updateUser } from "../store/slices/authSlice";
import {isEmail } from "../regex/regex";
import { toast } from "react-toastify";

const Signup = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState(null); // Add state for error handling
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSignup = async () => {
    try {
      if (!isEmail(email)) {
        toast.error("Invalid email");
        return;
      }
      if(password.length < 6){
        toast.error("Password must be at least 6 characters");
        return;
      }
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
        email,
        name: fullName,
        password,
      });

      // Handle successful signup
      console.log("Signup successful:", response.data);
      // Redirect or perform any action upon successful signup
      dispatch(updateUser(response.data.user));
      navigate('/');
    } catch (error) {
      // Handle errors
      console.error("Signup error:", error);
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle textAlign={"center"}>Sign up</DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" variant="body2" align="center">
            {error}
          </Typography>
        )}
        <TextField
          label="Full name"
          type="text"
          variant="outlined"
          fullWidth
          margin="normal"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSignup} // Call handleSignup instead of handleLogin
          style={{ marginTop: "20px", marginBottom: "10px" }}
        >
          Sign Up
        </Button>
        <Divider>or</Divider>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<GoogleIcon />}
          style={{ marginTop: "10px" }}
        >
          Continue with Google
        </Button>
        <Box style={{ marginTop: "20px", textAlign: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link
              href="#"
              onClick={() => {
                navigate("/login");
              }}
            >
              Log in
            </Link>{" "}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Signup;
