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
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";

const Login = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Email:", email, "Password:", password);
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Welcome back</DialogTitle>
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
          InputProps={{
            endAdornment: (
              <IconButton>
                {/* Add eye icon for show/hide password functionality */}
              </IconButton>
            ),
          }}
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
        <Box style={{ marginTop: "20px", textAlign: "center" }}>
          <Link href="#">New to our website? Sign up</Link>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Login;
