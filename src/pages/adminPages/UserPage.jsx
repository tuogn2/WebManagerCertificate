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
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user list from API (example data)
    setUsers([
      {
        _id: "66cf26076a8d144b2ce19e5f",
        name: "Nhom6",
        email: "conguyetnaduongvulan@gmail.com",
        password:
          "$2b$10$mV4IzfILkjUPHGv0lhCs/OW60dSAl1yLppFO61tl6JJNCPiNA.LAu",
        role: "admin",
        birthday: new Date("1990-01-01T00:00:00.000Z"),
        numberphone: "1234567890",
        address: "123 Main St, City, Country",
        avt: "path/to/avatar.jpg",
        certificates: ["66e144b6b70332dc56485bed", "66e1455ab70332dc56485c99"],
        enrollments: [
          "66e04ec56bf03bfdc7332666",
          "66e052006bf03bfdc73326ea",
          "66e144acb70332dc56485ba8",
          "66e14534b70332dc56485c54",
        ],
        createdAt: new Date("2024-08-28T13:28:39.412Z"),
        __v: 2,
      },
      {
        _id: "66cf274eae3f9818e3618b77",
        name: "Nhom6",
        email: "conguyetnaduongvulan1@gmail.com",
        password:
          "$2b$10$LeCAsWm8hPElEV2Sbp1qHe3wKi8jXuykyZ0Mzpt0fdYHQ.na55fNq",
        role: "admin",
        birthday: new Date("1990-01-01T00:00:00.000Z"),
        numberphone: "1234567890",
        address: "123 Main St, City, Country",
        avt: "path/to/avatar.jpg",
        certificates: [
          "66e1b45072c86d83147bdfe3",
          "66e3c320b117571a4365e1b3",
          "66e3c38ab117571a4365e33f",
        ],
        enrollments: [
          "66d042a92297035b09b98050",
          "66d1ae857b40dad86c82c5f4",
          "66d446cd0bcbe4a73b13b793",
          "66d446f080bf22f2e7215cb6",
          "66d44760f920351441e6db3c",
          "66e1b43172c86d83147bdf2a",
          "66e3a5d0703849e4e7b833d5",
        ],
        createdAt: new Date("2024-08-28T13:34:06.978Z"),
        __v: 3,
      },
      {
        _id: "66cf27d82cdd46756101d2f2",
        name: "Nhom6",
        email: "conguyetnaduongvulan11@gmail.com",
        password:
          "$2b$10$lfghb/hb09GaDpPQjxqI2e3ztZNPchVpUKfM1.TD/HILLWywosAWK",
        role: "admin",
        birthday: new Date("1990-01-01T00:00:00.000Z"),
        numberphone: "1234567890",
        address: "123 Main St, City, Country",
        avt: "path/to/avatar.jpg",
        certificates: [
          "66e1400fb70332dc564854ac",
          "66e141c6b70332dc5648573c",
          "66e1424fb70332dc5648582e",
          "66e14366b70332dc56485999",
          "66e143e2b70332dc56485a69",
          "66e14433b70332dc56485b3f",
          "66e153f03744d6bdda9e3f3d",
          "66e158b63744d6bdda9e3f63",
          "66e159f03744d6bdda9e400f",
          "66e2aa6b951eb9554732f909",
          "66e2b567a9d7a2ec02f05148",
        ],
        enrollments: [
          "66dfd8d740c904f18b0ee6e5",
          "66dfdf8640c904f18b0ee76b",
          "66dfe01e40c904f18b0ee7f1",
          "66dfe12540c904f18b0ee8b3",
          "66dff26140c904f18b0eebd4",
          "66e045126bf03bfdc7332473",
          "66e04a166bf03bfdc733258a",
          "66e11c08b70332dc564851a9",
          "66e153dd3744d6bdda9e3ed8",
          "66e159e83744d6bdda9e3fca",
          "66e2a727b4d4f6cdf1408639",
          "66e2b54da9d7a2ec02f05087",
        ],
        createdAt: new Date("2024-08-28T13:36:24.162Z"),
        __v: 14,
      },
      {
        _id: "66dee2b5bba2996051b562de",
        name: "tuong",
        email: "testchangpass@gmail.com",
        password:
          "$2b$10$lfghb/hb09GaDpPQjxqI2e3ztZNPchVpUKfM1.TD/HILLWywosAWK",
        role: "customer",
        birthday: new Date("1990-01-01T00:00:00.000Z"),
        numberphone: "1234567890",
        address: "123 Main St, City, Country",
        avt: "path/to/avatar.jpg",
        certificates: ["66e3c5d1b117571a4365e56f"],
        enrollments: ["66e3c5a5b117571a4365e4b6"],
        createdAt: new Date("2024-09-09T11:57:41.361Z"),
        __v: 1,
      },
      {
        _id: "66e419c955a757d0adb0632d",
        name: "Nhom6",
        email: "checkblock@gmail.com",
        password:
          "$2b$10$H67YbauC3mo52BTVDeT48uiMsinP1CId9th0s8ywCXgz3nyU.vqgG",
        role: "customer",
        birthday: new Date("1990-01-01T00:00:00.000Z"),
        numberphone: "1234567890",
        address: "123 Main St, City, Country",
        avt: "path/to/avatar.jpg",
        certificates: ["66e41af655a757d0adb06517"],
        enrollments: ["66e41ac555a757d0adb0645e"],
        createdAt: new Date("2024-09-13T10:54:01.067Z"),
        __v: 1,
      },
    ]);
  }, []);

  const handleDialogOpen = (user = null) => {
    setSelectedUser(user);
    setIsEditing(!!user);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter((user) => user._id !== userId));
  };

  const handleSaveUser = () => {
    if (isEditing) {
      setUsers(
        users.map((user) =>
          user._id === selectedUser._id ? selectedUser : user
        )
      );
    } else {
      setUsers([...users, selectedUser]);
    }
    handleDialogClose();
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

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
