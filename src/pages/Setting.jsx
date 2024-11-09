import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Grid,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Toolbar,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { logoutUser } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const Setting = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  useEffect(() => {
    setIsPasswordValid(passwordRegex.test(newPassword));
    setIsPasswordMatch(newPassword === retypePassword);
  }, [newPassword, retypePassword]);

  const [selectedSection, setSelectedSection] = useState(
    "Password and Security"
  );

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const changePasswordHandler = async () => {
    if (!isPasswordValid || !isPasswordMatch) {
      alert("Password is invalid or does not match.");
      return;
    }
    const token = localStorage.getItem("token");

    const payload = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/change-password/${user._id ?? user.id}`,
        payload,
        { headers: headers }
      );

      if (response.status === 200) {
        setCurrentPassword("");
        setNewPassword("");
        setRetypePassword("");
        toast.success("Password changed successfully");
      } else {
        alert("Failed to change password");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to change password");
    }
  };

  const handleListItemClick = (section) => {
    setSelectedSection(section);
  };

  const token = localStorage.getItem("token");

  const handleCloseAccount = async () => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/users/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Account deleted successfully");
        dispatch(logoutUser());
        navigate("/login");
      } else {
        alert("Failed to delete account");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete account");
    } finally {
      setOpenConfirmDialog(false);
    }
  };

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "Password and Security":
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, color: "Highlight" }}>
              Password
            </Typography>
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              sx={{ mb: 2 }}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              sx={{ mb: 2 }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={!isPasswordValid && newPassword !== ""}
              helperText={
                !isPasswordValid && newPassword !== ""
                  ? "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
                  : ""
              }
            />
            <TextField
              fullWidth
              label="Retype New Password"
              type="password"
              sx={{ mb: 2 }}
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              error={!isPasswordMatch && retypePassword !== ""}
              helperText={
                !isPasswordMatch && retypePassword !== ""
                  ? "Passwords do not match."
                  : ""
              }
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="contained"
                color="primary"
                disabled={!isPasswordValid || !isPasswordMatch}
                onClick={changePasswordHandler}
              >
                Change Password
              </Button>
              <Typography variant="body2" sx={{ mt: 2 }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate(`/forgot-password?email=${encodeURIComponent(user.email)}`)}
                >
                  Forgot Password?
                </Link>
              </Typography>
            </Box>
          </Box>
        );
      case "Close Account":
        return (
          <Box sx={{ p: 3 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" color="error">
              <strong>Warning:</strong> If you close your account, you will lose
              access to all of your courses and associated data permanently.
            </Typography>
            <Button
              variant="contained"
              color="error"
              sx={{ mt: 2 }}
              onClick={handleOpenConfirmDialog}
            >
              Delete Account
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        <Box mt={3}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "Highlight",
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            Settings
          </Typography>
        </Box>
        <Container maxWidth="lg" sx={{ mt: 2 }}>
          <Grid container spacing={10}>
            <Grid item xs={12} md={4}>
              <Paper elevation={5}>
                <Divider sx={{ mb: 2 }} />
                <List component="nav">
                  <ListItemButton
                    onClick={() => handleListItemClick("Password and Security")}
                    sx={{
                      backgroundColor:
                        selectedSection === "Password and Security"
                          ? "Highlight"
                          : "transparent",
                      "&:hover": {
                        backgroundColor: "Highlight",
                        color: "white",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <LockIcon />
                    </ListItemIcon>
                    <ListItemText primary="Password and Security" />
                  </ListItemButton>
                  <ListItemButton
                    onClick={() => handleListItemClick("Close Account")}
                    sx={{
                      backgroundColor:
                        selectedSection === "Close Account"
                          ? "Highlight"
                          : "transparent",
                      "&:hover": {
                        backgroundColor: "Highlight",
                        color: "white",
                      },
                    }}
                  >
                    <ListItemIcon>
                      <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText primary="Close Account" />
                  </ListItemButton>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper elevation={5} sx={{ p: 3, minHeight: "300px" }}>
                {renderContent()}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Container>

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseAccount} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </>
  );
};

export default Setting;
