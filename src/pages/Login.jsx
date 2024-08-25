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

const Login = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Email:", email, "Password:", password);
  };

  const navigate = useNavigate();

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle textAlign={"center"}>Welcome</DialogTitle>
      <DialogContent>
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
        <Link href="#" variant="body2">
          Forgot password?
        </Link>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          style={{ marginTop: "20px", marginBottom: "10px" }}
        >
          Login
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
        <Box
          sx={{
            marginTop: "20px",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2">
            New to our website?{" "}
            <Link
              href="#"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Login;
