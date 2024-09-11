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
  const [open, setOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  useEffect(() => {
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

    fetchOrganizations();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = (organization) => {
    setSelectedOrganization(organization);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
      setOpen(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
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
              <Paper key={org._id} sx={{ mb: 2 }}>
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
                    onClick={() => handleClickOpen(org)}
                  >
                    Update
                  </Button>
                  <Button variant="outlined" color="error">
                    Delete
                  </Button>
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </TabPanel>

      {/* Update Organization Dialog */}
      <Dialog open={open} onClose={handleClose}>
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
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Organization */}
      <TabPanel value={value} index={1}>
        <Typography variant="h6">Add New Organization</Typography>
        <TextField fullWidth label="Organization Name" margin="normal" />
        <TextField fullWidth label="Address" margin="normal" />
        <TextField fullWidth label="Email" margin="normal" />
        <TextField fullWidth label="Avatar URL" margin="normal" />
        <TextField fullWidth label="Password" type="password" margin="normal" />
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Add Organization
        </Button>
      </TabPanel>
    </Box>
  );
}
