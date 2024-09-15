import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  CircularProgress,
  List,
  Paper,
  ListItem,
  ListItemText,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert,
} from "@mui/material";
import PropTypes from "prop-types";
import { API_BASE_URL } from "../../utils/constants";
import axios from "axios";

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function OrganizationPage() {
  const [value, setValue] = useState(0);

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/organization`);
      setOrganizations(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Update organization

  const handleClickOpenUpdate = (organization) => {
    setSelectedOrganization(organization);
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setSelectedOrganization(null);
  };

  const handleUpdate = async () => {
    // Call API to update organization
    console.log(selectedOrganization);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/organization/${selectedOrganization._id}`,
        selectedOrganization
      );
      // Assuming response.data contains the updated list of organizations
      setOrganizations((prevOrganizations) =>
        prevOrganizations.map((org) =>
          org._id === selectedOrganization._id ? response.data : org
        )
      );
      setLoading(false);
      setOpenUpdate(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // delete organization
  const handleClickOpenDelete = (organization) => {
    setSelectedOrganization(organization);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedOrganization(null);
  };

  const handleDeleteConfirm = async () => {
    // Call API to delete organization
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/organization/${selectedOrganization._id}`
      );
      // Assuming response.data contains the updated list of organizations
      setOrganizations((prevOrganizations) =>
        prevOrganizations.filter((org) => org._id !== selectedOrganization._id)
      );
      console.log(response.data);
      setLoading(false);
      setOpenDelete(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Add organization
  const [organization, setOrganization] = useState({
    name: "",
    address: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false); // To show success message
  const [errorSnackbar, setErrorSnackbar] = useState(false); // To show error message

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrganization({
      ...organization,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send data to the API using axios
      const response = await axios.post(
        `${API_BASE_URL}/organization`,
        organization
      );

      // If successful, show success message
      if (response.status === 201) {
        setOpenSnackbar(true); // Open success message

        // Fetch the updated list of organizations
        fetchOrganizations();
        setOrganization({
          name: "",
          address: "",
          email: "",
          password: "",
          avatar: "",
        }); // Reset the form
      }
    } catch (error) {
      console.error("Error adding organization:", error);
      setErrorSnackbar(true); // Open error message
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Organization management tabs"
        >
          <Tab label="View Organization" {...a11yProps(0)} />
          <Tab label="Add Organization" {...a11yProps(1)} />
        </Tabs>
      </Box>

      {/* View Organization */}
      <TabPanel value={value} index={0}>
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {organizations.map((org) => (
              <Paper elevation={5} key={org._id} sx={{ mb: 2 }}>
                <ListItem>
                  <Avatar src={org.avatar} sx={{ mr: 2 }} />
                  <ListItemText
                    primary={org.name}
                    secondary={`Address: ${org.address} | Email: ${org.email}`}
                  />
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 3 }}
                    onClick={() => handleClickOpenUpdate(org)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleClickOpenDelete(org)}
                  >
                    Delete
                  </Button>
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </TabPanel>

      {/* Update Organization Dialog */}
      <Dialog open={openUpdate} onClose={handleCloseUpdate}>
        <DialogTitle>Update Organization</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Organization Name"
            margin="normal"
            value={selectedOrganization?.name || ""}
            onChange={(e) =>
              setSelectedOrganization({
                ...selectedOrganization,
                name: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            label="Address"
            margin="normal"
            value={selectedOrganization?.address || ""}
            onChange={(e) =>
              setSelectedOrganization({
                ...selectedOrganization,
                address: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={selectedOrganization?.email || ""}
            onChange={(e) =>
              setSelectedOrganization({
                ...selectedOrganization,
                email: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            label="Avatar URL"
            margin="normal"
            value={selectedOrganization?.avatar || ""}
            onChange={(e) =>
              setSelectedOrganization({
                ...selectedOrganization,
                avatar: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdate} color="error">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete dialog */}
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledbyy="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          {"Delete Organization"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            Are you sure you want to delete this organization? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Organization */}
      <TabPanel value={value} index={1}>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Organization Name"
              name="name"
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Address"
              name="address"
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Password"
              name="password"
              onChange={handleInputChange}
              type="password"
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Avatar URL"
              name="avatar"
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Metamask Address"
              name="metamaskAddress"
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />

            <Button variant="contained" color="primary" type="submit" fullWidth>
              Add Organization
            </Button>
          </form>
        </Paper>

        {/* Success Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert onClose={() => setOpenSnackbar(false)} severity="success">
            Organization added successfully!
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={errorSnackbar}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          onClose={() => setErrorSnackbar(false)}
        >
          <Alert onClose={() => setErrorSnackbar(false)} severity="error">
            Failed to add organization. Please try again.
          </Alert>
        </Snackbar>
      </TabPanel>
    </Box>
  );
}
