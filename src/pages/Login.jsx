import React, { useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import { clearError, loginUser, updateUser } from "../store/slices/authSlice";
import { auth, provider, signInWithPopup } from "../firebase"; // Updated import
import { API_BASE_URL } from "../utils/constants";
import axios from "axios";

const Login = ({ open, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError()); // Xóa lỗi khi trang Login được mở
  }, [dispatch]);
  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/admin-home");
    } else if (user && user.role === "customer") 
      navigate("/");
    else if (user && user.role === "organization")
      navigate("/organization-home");
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Set default values
  useEffect(() => {
    setEmail("");
    setPassword("");
    // setEmail("tranhuy12072003@gmail.com");
    // setPassword("123456789");
  }, []);

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Logged in with Google:", user);

      // Gọi API để xử lý đăng nhập Google
      const response = await axios.post(
        `${API_BASE_URL}/auth/login-with-google`,
        {
          email: user.email,
          name: user.displayName,
          avt: user.photoURL,
        }
      );

      console.log("Google login response:", response.data);

      if (response.data && response.data.token) {
        // Lưu thông tin người dùng và token
        

        dispatch(updateUser(response.data.user));
        localStorage.setItem("token", response.data.token);

        // Điều hướng sang trang tương ứng dựa trên vai trò của người dùng
        navigate("/"); // Thay đổi tùy vào logic của bạn

        toast.success("Google login successful");
      } else {
        throw new Error("Login failed: No token received");
      }
    } catch (error) {
      console.error("Error logging in with Google:", error);
      toast.error("Failed to login with Google");
    }
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
        <Link
          href="#"
          variant="body2"
          onClick={() => navigate("/forgot-password")}
        >
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
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </Button>
        <Box style={{ marginTop: "20px", textAlign: "center" }}>
          <Typography>
            New to our website?{" "}
            <Link href="#" onClick={() => navigate("/signup")}>
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
