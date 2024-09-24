import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Avatar,
  Pagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { API_BASE_URL } from "../../utils/constants";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null); // New state for file input

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users`, {
          params: { page: currentPage, limit: 6, search: searchQuery },
        });
        setUsers(response.data.users); 
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [currentPage, searchQuery]);

  const handleDialogOpen = (user = null) => {
    setSelectedUser(user);
    setIsEditing(!!user);
    setDialogOpen(true);
    setAvatarFile(null); // Reset avatar file when opening dialog
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setAvatarFile(null); // Reset avatar file when closing dialog
  };

  const handleDeleteDialogOpen = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${userToDelete._id}`);
      setUsers(users.filter((user) => user._id !== userToDelete._id));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user.");
      console.error("Error deleting user:", error);
    } finally {
      handleDeleteDialogClose();
    }
  };

  const handleSaveUser = async () => {
    const formData = new FormData();
    try {
      if (isEditing) {
        // Append user data to FormData only if they are defined
        if (selectedUser.name) {
          formData.append("name", selectedUser.name);
        }
        if (selectedUser.email) {
          formData.append("email", selectedUser.email);
        }
        if (selectedUser.numberphone) {
          formData.append("numberphone", selectedUser.numberphone);
        }
        if (selectedUser.address) {
          formData.append("address", selectedUser.address);
        }
        if (selectedUser.birthday) {
          formData.append("birthday", selectedUser.birthday);
        }
        if (avatarFile) {
          formData.append("avt", avatarFile); // Append avatar file if provided
        }
  
        await axios.put(`${API_BASE_URL}/users/change-infor/${selectedUser._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
  
        // Update user in the local state
        setUsers(
          users.map((user) =>
            user._id === selectedUser._id ? { ...user, ...selectedUser } : user
          )
        );
        toast.success("User updated successfully!");
      }
      handleDialogClose();
    } catch (error) {
      toast.error("Failed to save user.");
      console.error("Error saving user:", error);
    }
  };
  

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Search Field */}
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      {/* User List */}
      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user._id}>
            <Card
              elevation={3}
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    src={user.avt}
                    alt={user.name}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6">{user.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Role: {user.role}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Phone: {user.numberphone}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Address: {user.address}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Birthday: {user.birthday}
                </Typography>
              </CardContent>
              <CardActions sx={{ mt: "auto", justifyContent: "flex-end" }}>
                <IconButton
                  onClick={() => handleDialogOpen(user)}
                  color="primary"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteDialogOpen(user)}
                  color="secondary"
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
          color="primary"
        />
      </Box>

      {/* Add/Edit User Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{isEditing ? "Edit User" : "User Details"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={selectedUser ? selectedUser.name : ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, name: e.target.value })
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={selectedUser ? selectedUser.email : ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, email: e.target.value })
            }
          />
          <TextField
            label="Phone Number"
            fullWidth
            margin="normal"
            value={selectedUser ? selectedUser.numberphone : ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, numberphone: e.target.value })
            }
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={selectedUser ? selectedUser.address : ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, address: e.target.value })
            }
          />
          <TextField
            label="Birthday"
            type="date"
            fullWidth
            margin="normal"
            value={selectedUser ? selectedUser.birthday : ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, birthday: e.target.value })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="avatar-file"
            type="file"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
          <label htmlFor="avatar-file">
            <Button variant="contained" component="span">
              Upload Avatar
            </Button>
          </label>
          {avatarFile && <Typography variant="body2">{avatarFile.name}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserPage;
