import React, { createRef, useEffect, useState } from "react";
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
  Input,
  Pagination,
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
  const inputFileRef = createRef(null); // Reference to the file input element

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [duplicateEmailError, setDuplicateEmailError] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrganizations = async (page = 1, query = "") => {
    setLoading(true); // Set loading to true before API call
    try {
      const response = await axios.get(`${API_BASE_URL}/organization`, {
        params: {
          page, // Send current page
          limit: 6, // You can adjust the limit as needed
          search: query, // Send search query if available
        },
      });
      setOrganizations(response.data.organizations);
      setTotalPages(response.data.totalPages); // Set total pages from response
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations(currentPage, searchQuery); // Fetch organizations with current page and search query
  }, [currentPage, searchQuery]); // Add searchQuery as a dependency

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
    const formData = new FormData();
    formData.append("name", selectedOrganization.name);
    formData.append("address", selectedOrganization.address);
    formData.append("walletaddress", selectedOrganization.walletaddress);
    formData.append("email", selectedOrganization.email);
  
    if (inputFileRef.current && inputFileRef.current.files.length > 0) {
      formData.append("avatar", inputFileRef.current.files[0]);
    }
  
    // Basic validation
    if (!selectedOrganization.name || !selectedOrganization.address || !selectedOrganization.walletaddress) {
      setError("Please fill all required fields.");
      return;
    }
  
    try {
      const response = await axios.put(
        `${API_BASE_URL}/organization/${selectedOrganization._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setOrganizations((prevOrganizations) =>
        prevOrganizations.map((org) =>
          org._id === selectedOrganization._id ? response.data : org
        )
      );
  
      setOpenUpdate(false);
      setSelectedOrganization(null); // Clear the selected organization after update
    } catch (error) {
      setError(error?.response?.data?.message||"Error updating organization:"); // Set the error message for notification
    }
  };
  
  // Delete organization
  const handleClickOpenDelete = (organization) => {
    setSelectedOrganization(organization);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setSelectedOrganization(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/organization/${selectedOrganization._id}/activate`
      );
      setOrganizations((prevOrganizations) =>
        prevOrganizations.filter((org) => org._id !== selectedOrganization._id)
      );
      setOpenDelete(false);
    } catch (error) {
      setError(error.message);
    }
  };

  // Add organization
  const [organization, setOrganization] = useState({
    name: "",
    address: "",
    email: "",
    password: "",
    avatar: null,
    walletaddress: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrganization({
      ...organization,
      [name]: value,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setOrganization({
        ...organization,
        avatar: file,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!organization.walletaddress || !organization.email) {
      setErrorSnackbar(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", organization.name);
      formData.append("address", organization.address);
      formData.append("email", organization.email);
      formData.append("password", organization.password);
      if (organization.avatar) {
        formData.append("avatar", organization.avatar);
      }
      formData.append("walletaddress", organization.walletaddress);

      const response = await axios.post(
        `${API_BASE_URL}/organization`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setOpenSnackbar(true);
        fetchOrganizations(currentPage); // Fetch organizations again to update the list

        setOrganization({
          name: "",
          address: "",
          email: "",
          password: "",
          avatar: null,
          walletaddress: "",
        });

        if (inputFileRef.current) {
          inputFileRef.current.value = null;
        }
      }
    } catch (error) {
      console.error("Error adding organization:", error);
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === "Email already exists"
      ) {
        setDuplicateEmailError(true); // Set the state for duplicate email error
      } else {
        setErrorSnackbar(true); // For other errors
      }
    }
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search button click
  const handleSearch = () => {
    fetchOrganizations(1, searchQuery); // Fetch organizations with search query and reset to first page
  };

  // Handle refresh button click
  const handleRefresh = () => {
    setSearchQuery(""); // Clear search query
    fetchOrganizations(currentPage, ""); // Fetch organizations without search query
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
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <TextField
            label="Search Organization"
            value={searchQuery}
            onChange={handleSearchInputChange}
            variant="outlined"
            size="small"
            sx={{ mr: 2 }}
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
          <Button variant="outlined" onClick={handleRefresh} sx={{ ml: 2 }}>
            Refresh
          </Button>
        </Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {organizations.length > 0 ? (
              organizations.map((org) => (
                <ListItem key={org._id}>
                  <Avatar style={{marginRight:'5px'}} src={org.avatar} />
                  <ListItemText
                    primary={org.name}
                    secondary={`Email: ${org.email} | Wallet Address: ${org.walletaddress}`}
                  />
                  <Button 
                  onClick={() => handleClickOpenUpdate(org)}>Update</Button>
                  <Button color="error" onClick={() => handleClickOpenDelete(org)}>Delete</Button>
                </ListItem>
              ))
            ) : (
              <Typography>No organizations found</Typography>
            )}
          </List>
        )}
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)} // Set current page based on pagination click
          variant="outlined"
          shape="rounded"
          sx={{ mt: 2 }}
        />
      </TabPanel>

      {/* Add Organization */}
      <TabPanel value={value} index={1}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={organization.name}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            value={organization.address}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={organization.email}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={organization.password}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Wallet Address"
            name="walletaddress"
            value={organization.walletaddress}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
          />
          <Input
            type="file"
            inputRef={inputFileRef}
            onChange={handleImageChange}
            fullWidth
            sx={{ mt: 2 }}
          />
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            Add Organization
          </Button>
        </form>
      </TabPanel>

      {/* Update Organization Dialog */}
      <Dialog open={openUpdate} onClose={handleCloseUpdate}>
        <DialogTitle>Update Organization</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the details of the selected organization.
          </DialogContentText>
          <TextField
            label="email"
            name="email"
            value={selectedOrganization?.email || ""}
            onChange={(e) =>
              setSelectedOrganization({
                ...selectedOrganization,
                email: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name"
            name="name"
            value={selectedOrganization?.name || ""}
            onChange={(e) =>
              setSelectedOrganization({
                ...selectedOrganization,
                name: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            value={selectedOrganization?.address || ""}
            onChange={(e) =>
              setSelectedOrganization({
                ...selectedOrganization,
                address: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Wallet Address"
            name="walletaddress"
            value={selectedOrganization?.walletaddress || ""}
            onChange={(e) =>
              setSelectedOrganization({
                ...selectedOrganization,
                walletaddress: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <Input
            type="file"
            inputRef={inputFileRef}
            onChange={handleImageChange}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdate}>Cancel</Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Organization Confirmation Dialog */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedOrganization?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirm} >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          Organization added successfully!
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar open={errorSnackbar} autoHideDuration={6000} onClose={() => setErrorSnackbar(false)}>
        <Alert onClose={() => setErrorSnackbar(false)} severity="error" sx={{ width: "100%" }}>
          Please fill in all required fields.
        </Alert>
      </Snackbar>

      {/* Duplicate Email Error Snackbar */}
      <Snackbar open={duplicateEmailError} autoHideDuration={6000} onClose={() => setDuplicateEmailError(false)}>
        <Alert onClose={() => setDuplicateEmailError(false)} severity="error" sx={{ width: "100%" }}>
          This email is already in use!
        </Alert>
      </Snackbar>

      {/* Error Alert */}
      {error && (
        <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
