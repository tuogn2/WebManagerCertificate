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
import { Add, Edit, Delete } from "@mui/icons-material";
import { API_BASE_URL } from "../../utils/constants";
import axios from "axios";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users`, {
          params: { page: currentPage, limit: 6, search: searchQuery },
        });
        setUsers(response.data.users); // Assuming API returns users in response.data.users
        setTotalPages(response.data.totalPages); // Assuming API returns total pages
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [currentPage, searchQuery]); // Re-fetch users when page or search query changes

  const handleDialogOpen = (user = null) => {
    setSelectedUser(user);
    setIsEditing(!!user);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${userId}`); // Assume you have a DELETE endpoint
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSaveUser = async () => {
    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/users/${selectedUser._id}`, selectedUser); // Assume you have a PUT endpoint
        setUsers(
          users.map((user) =>
            user._id === selectedUser._id ? selectedUser : user
          )
        );
      } else {
        const response = await axios.post(`${API_BASE_URL}/users`, selectedUser); // Assume you have a POST endpoint
        setUsers([...users, response.data]); // Add newly created user
      }
      handleDialogClose();
    } catch (error) {
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

      {/* Search Field */}
      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 3 }}
      />

      {/* Add User Button */}
      <Box display="flex" justifyContent="flex-end" sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleDialogOpen(null)}
        >
          Add User
        </Button>
      </Box>

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
              </CardContent>
              <CardActions sx={{ mt: "auto", justifyContent: "flex-end" }}>
                <IconButton
                  onClick={() => handleDialogOpen(user)}
                  color="primary"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteUser(user._id)}
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
        <DialogTitle>{isEditing ? "Edit User" : "Add User"}</DialogTitle>
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
            label="Role"
            fullWidth
            margin="normal"
            value={selectedUser ? selectedUser.role : ""}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, role: e.target.value })
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained">
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserPage;
