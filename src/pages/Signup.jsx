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

const Signup = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Email:", email, "Password:", password);
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle textAlign={"center"}>Sign up</DialogTitle>
      <DialogContent>
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
          onClick={handleLogin}
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
