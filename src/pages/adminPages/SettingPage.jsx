import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  InputAdornment,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../store/slices/authSlice";
import axios from "axios";
import { API_BASE_URL } from "../../utils/constants";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function SettingPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [adminDetails, setAdminDetails] = useState({
    name: user.name || "",
    email: user.email || "",
    birthday: user.birthday ? user.birthday.split("T")[0] : "",
    numberphone: user.numberphone || "",
    address: user.address || "",
  });

  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Dialog states
  const [openConfirmSave, setOpenConfirmSave] = useState(false);
  const [openConfirmChangePassword, setOpenConfirmChangePassword] = useState(false);

  useEffect(() => {
    if (user) {
      setAdminDetails({
        name: user.name || "",
        email: user.email || "",
        birthday: user.birthday ? user.birthday.split("T")[0] : "",
        numberphone: user.numberphone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/change-infor/${user._id || user.id}`, adminDetails);
      dispatch(updateUser(response.data));
      setSnackbarMessage("User details updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenConfirmSave(false); // Close dialog
    } catch (error) {
      console.error("Error updating user details:", error);
      const errorMessage = error.response?.data?.message || "Error updating user details.";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setOpenConfirmSave(false); // Close dialog
    }
  };

  const handleChangePassword = async () => {
    if (passwordDetails.newPassword !== passwordDetails.confirmNewPassword) {
      setSnackbarMessage("New passwords do not match.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/users/change-password/${user._id || user.id}`, {
        currentPassword: passwordDetails.oldPassword,
        newPassword: passwordDetails.newPassword,
      });
      setPasswordDetails({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOpenConfirmChangePassword(false); // Close dialog
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMessage = error.response?.data?.message || "Error changing password.";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setOpenConfirmChangePassword(false); // Close dialog
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>
        {/* Account Settings */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <AccountCircleIcon /> Account Settings
            </Typography>
            <Avatar
              src={user.avt || "path/to/default/avatar.jpg"}
              sx={{ width: 80, height: 80, mb: 2 }}
            />
            <TextField
              label="Admin Name"
              name="name"
              fullWidth
              value={adminDetails.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={adminDetails.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Birthday"
              name="birthday"
              type="date"
              fullWidth
              value={adminDetails.birthday}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Phone Number"
              name="numberphone"
              type="tel"
              fullWidth
              value={adminDetails.numberphone}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Address"
              name="address"
              type="text"
              fullWidth
              value={adminDetails.address}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenConfirmSave(true)} // Open confirmation dialog
            >
              Save Changes
            </Button>
          </Paper>
        </Grid>
        {/* Change Password */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Change Password
            </Typography>
            <TextField
              label="Old Password"
              name="oldPassword"
              type={showPasswords.oldPassword ? "text" : "password"}
              fullWidth
              value={passwordDetails.oldPassword}
              onChange={handlePasswordChange}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={() => setShowPasswords((prev) => ({ ...prev, oldPassword: !prev.oldPassword }))}>
                      {showPasswords.oldPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="New Password"
              name="newPassword"
              type={showPasswords.newPassword ? "text" : "password"}
              fullWidth
              value={passwordDetails.newPassword}
              onChange={handlePasswordChange}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={() => setShowPasswords((prev) => ({ ...prev, newPassword: !prev.newPassword }))}>
                      {showPasswords.newPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm New Password"
              name="confirmNewPassword"
              type={showPasswords.confirmNewPassword ? "text" : "password"}
              fullWidth
              value={passwordDetails.confirmNewPassword}
              onChange={handlePasswordChange}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={() => setShowPasswords((prev) => ({ ...prev, confirmNewPassword: !prev.confirmNewPassword }))}>
                      {showPasswords.confirmNewPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenConfirmChangePassword(true)} // Open confirmation dialog
            >
              Change Password
            </Button>
          </Paper>
        </Grid>
      </Grid>
      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog for Save Changes */}
      <Dialog open={openConfirmSave} onClose={() => setOpenConfirmSave(false)}>
        <DialogTitle>Confirm Save Changes</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to save the changes?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmSave(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Change Password */}
      <Dialog open={openConfirmChangePassword} onClose={() => setOpenConfirmChangePassword(false)}>
        <DialogTitle>Confirm Change Password</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to change your password?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmChangePassword(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleChangePassword} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
