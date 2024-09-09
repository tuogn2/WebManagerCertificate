import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  InputAdornment,
  Typography,
} from "@mui/material";
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import thư viện Toastify
import { loginUser } from "../store/slices/authSlice";

const Login = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/admin-home");
    } else if (user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error); // Hiển thị toast lỗi
    }
  }, [error]);

  // Cập nhật giá trị mặc định khi component được render
  useEffect(() => {
    setEmail("conguyetnaduongvulan11@gmail.com");
    setPassword("123456789");
  }, []);

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
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
          // disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
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
          <Typography>
            New to our website?{" "}
            <Link
              href="#"
              onClick={() => {
                navigate("/signup");
              }}
            >
              {" "}
              Sign up
            </Link>
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Login;
