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
      const response = await axios.put(
        `${API_BASE_URL}/organization/${selectedOrganization._id}/activate`
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
    avatar: null,
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setOrganization({
        ...organization,
        avatar: file, // Store the file object directly
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xem các trường bắt buộc có được điền không
    if (!organization.walletAddress || !organization.email) {
      setErrorSnackbar(true); // Hiển thị thông báo lỗi
      return;
    }

    try {
      // Tạo một đối tượng FormData
      const formData = new FormData();
      formData.append("name", organization.name);
      formData.append("address", organization.address);
      formData.append("email", organization.email);
      formData.append("password", organization.password);
      if (organization.avatar) {
        formData.append("avatar", organization.avatar); // Thêm tệp hình ảnh
      }
      formData.append("walletaddress", organization.walletAddress); // Thêm địa chỉ ví

      // Gửi dữ liệu đến API bằng axios
      const response = await axios.post(
        `${API_BASE_URL}/organization`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Đặt kiểu nội dung là multipart/form-data
          },
        }
      );

      // Nếu thành công, hiển thị thông báo thành công
      if (response.status === 201) {
        setOpenSnackbar(true);

        // Lấy danh sách tổ chức đã cập nhật
        fetchOrganizations();

        // Xóa các trường của form
        setOrganization({
          name: "",
          address: "",
          email: "",
          password: "",
          avatar: null,
          walletAddress: "", // Đặt lại địa chỉ ví
        });

        if (inputFileRef.current) {
          inputFileRef.current.value = null;
        }
      }
    } catch (error) {
      console.error("Error adding organization:", error);
      setErrorSnackbar(true); // Mở thông báo lỗi
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
            label="Email"
            margin="normal"
            value={selectedOrganization?.email || ""}
            disabled // Disable this field
          />
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
            label="Wallet Address"
            margin="normal"
            value={selectedOrganization?.walletaddress || ""}
            onChange={(e) =>
              setSelectedOrganization({
                ...selectedOrganization,
                walletaddress: e.target.value,
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
              value={organization.name}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Address"
              name="address"
              value={organization.address}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              required
              value={organization.email}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Password"
              name="password"
              value={organization.password}
              onChange={handleInputChange}
              type="password"
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <Input
              type="file"
              onChange={handleImageChange}
              ref={inputFileRef}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Wallet Address"
              name="walletAddress"
              value={organization.walletAddress}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 2 }}
              required // Thêm thuộc tính required để nhấn mạnh rằng trường này là bắt buộc
            />

            <Button variant="contained" color="primary" type="submit" fullWidth>
              Add Organization
            </Button>
          </form>
        </Paper>
        {/* wallet email require */}
        <Snackbar
          open={errorSnackbar}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          onClose={() => setErrorSnackbar(false)}
        >
          <Alert onClose={() => setErrorSnackbar(false)} severity="error">
            Wallet Address and Email are required fields. Please fill them out
            and try again.
          </Alert>
        </Snackbar>
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
