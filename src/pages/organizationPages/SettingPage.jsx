import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { API_BASE_URL } from "../../utils/constants";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SettingPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [organization, setOrganization] = useState({
    name: "",
    address: "",
    email: "",
    walletaddress: "",
    avatar: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirmation password state
  const [oldPassword, setOldPassword] = useState("");
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [confirmChange, setConfirmChange] = useState(false);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/organization/${user.id || user._id}`);
        setOrganization({
          name: response.data.name,
          address: response.data.address,
          email: response.data.email,
          walletaddress: response.data.walletaddress,
          avatar: response.data.avatar,
        });
        setAvatarPreview(response.data.avatar);
      } catch (error) {
        setError("Failed to fetch organization details");
        console.error("Error fetching organization:", error);
        toast.error("Failed to fetch organization details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrganization((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setOrganization((prev) => ({ ...prev, avatar: file }));

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };
  const token = localStorage.getItem('token');
  
  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", organization.name);
    formData.append("address", organization.address);
    formData.append("email", organization.email);
    formData.append("walletaddress", organization.walletaddress);

    if (organization.avatar) {
      formData.append("avatar", organization.avatar);
    }

    try {
      await axios.put(`${API_BASE_URL}/organization/${user.id || user._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, 
        },
      });
      setSaving(false);
      toast.success("Organization updated successfully!");
    } catch (error) {
      setSaving(false);
      setError("Failed to update organization");
      toast.error("Failed to update organization");
      console.error("Error updating organization:", error);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/organization/${user.id || user._id}/change-password`, {
        oldPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },});
      setOpenPasswordDialog(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword(""); // Reset confirmation password
      toast.success("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
  <Button
    variant="outlined"
    color="primary"
    onClick={() => setOpenPasswordDialog(true)} // Open change password dialog
    sx={{
      position: 'fixed',
      top: '20px', // Position from the top
      right: '20px', // Position from the right
    }}
  >
    Change Password
  </Button>
  <Typography variant="h4" gutterBottom>
    Update Organization Info
  </Typography>
</Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={organization.name}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={organization.address}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            disabled
            fullWidth
            label="Email"
            name="email"
            value={organization.email}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Wallet Address"
            name="walletaddress"
            value={organization.walletaddress}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" gutterBottom>
            Avatar
          </Typography>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </Grid>
        {avatarPreview && (
          <Grid item xs={12}>
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              style={{ width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover" }}
            />
          </Grid>
        )}
      </Grid>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setConfirmChange(true)} // Open confirmation dialog
        sx={{ mt: 3 }}
        disabled={saving}
      >
        {saving ? <CircularProgress size={24} /> : "Save Changes"}
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={confirmChange} onClose={() => setConfirmChange(false)}>
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to save these changes?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmChange(false)}>Cancel</Button>
          <Button onClick={() => { handleSave(); setConfirmChange(false); }}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Old Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handleChangePassword}>Change Password</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Container>
  );
};

export default SettingPage;
