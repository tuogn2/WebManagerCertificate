import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  TextField,
  Toolbar,
  Typography,
  Paper,
  styled,
} from "@mui/material";
import Header from "../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "../utils/constants";
import { updateUser } from "../store/slices/authSlice";

const UserProfile = () => {
  const dispatch = useDispatch(); // Get the dispatch function
  const oldUser = useSelector((state) => state.auth.user);
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState(oldUser);
  const [avatarURL, setAvatarURL] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Clean up the object URL when the component unmounts or the avatar changes
    return () => {
      if (avatarURL) {
        URL.revokeObjectURL(avatarURL);
      }
    };
  }, [avatarURL]);

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => {
    setOpenModal(false);
    setUser(oldUser);
    setAvatarURL(null);
  };

  if (!user) {
    return <Typography variant="h6">No user data available</Typography>;
  }

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      setUser({
        ...user,
        avt: file,
      });
      setAvatarURL(URL.createObjectURL(file));
    }
  };

  // Handle file input button click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle profile update (with file upload)
  const handleProfileUpdate = async () => {
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("address", user.address);
    formData.append("birthday", user.birthday);
    formData.append("email", user.email);
    formData.append("numberphone", user.numberphone);

    // Append the file if it exists
    if (user.avt) {
      formData.append("avt", user.avt);
    }

    try {
      const token = localStorage.getItem("token");
      console.log(formData.get("name"));
      console.log(formData.get("address"));
      console.log(formData.get("birthday"));
      console.log(formData.get("email"));
      console.log(formData.get("numberphone"));
      console.log(formData.get("avt"));
      const id = oldUser.id === undefined ? oldUser._id : oldUser.id;
      const response = await axios.put(
        `${API_BASE_URL}/users/change-infor/${id}`, // Replace with your actual API endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Profile updated successfully:", response.data);
        dispatch(updateUser(response.data));
        alert("Profile updated successfully!");
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    handleProfileUpdate();
  };

  // Hidden input for file upload
  const HiddenInput = styled("input")({
    display: "none",
  });

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Left Sidebar - Personal Details */}
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box display={"flex"}>
                    <Typography variant="h5" m={3} sx={{ alignSelf: "center" }}>
                      Personal details
                    </Typography>
                    <IconButton
                      sx={{ alignSelf: "flex-start" }}
                      onClick={handleModalOpen}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <Dialog
                      open={openModal}
                      maxWidth="sm"
                      fullWidth
                      keepMounted={true}
                    >
                      <form onSubmit={handleSubmit}>
                        <DialogTitle>
                          Personal details
                          <IconButton
                            aria-label="close"
                            onClick={handleModalClose}
                            sx={{ position: "absolute", right: 8, top: 8 }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            gutterBottom
                          >
                            Add your personal details as you would like it to
                            appear on your profile.
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              textAlign: "center",
                              mt: 2,
                            }}
                          >
                            <Avatar
                              sx={{ width: 100, height: 100, margin: "0 auto" }}
                              alt="Profile Picture"
                              // Nếu user.avt không null thì hiển thị user.avt, ngược lại hiển thị oldUser.avt
                              src={avatarURL || oldUser.avt}
                            />
                            <Typography variant="subtitle1" sx={{ mt: 2 }}>
                              Profile Photo
                            </Typography>
                            <Box
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <Button
                                variant="contained"
                                sx={{ mt: 1, mr: 1 }}
                                onClick={handleButtonClick}
                              >
                                Change photo
                              </Button>
                              <HiddenInput
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                              />
                            </Box>
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ mt: 2, mb: 3 }}
                            >
                              Maximum size: 1MB. Supported formats: JPG, GIF, or
                              PNG.
                            </Typography>
                            <FormControl sx={{ display: "flex" }}>
                              <Typography
                                component="label"
                                variant="body1"
                                fontWeight={"bold"}
                                sx={{ alignSelf: "flex-start" }}
                                gutterBottom
                              >
                                First and last name{" "}
                                <Typography
                                  component="span"
                                  sx={{ color: "red" }}
                                >
                                  *
                                </Typography>
                              </Typography>
                              <TextField
                                type="text"
                                value={user.name}
                                name="name"
                                required
                                onChange={handleInputChange}
                              />
                              <Typography
                                component="label"
                                variant="body1"
                                fontWeight={"bold"}
                                sx={{ alignSelf: "flex-start" }}
                                gutterBottom
                              >
                                Location
                              </Typography>
                              <TextField
                                value={user.address}
                                name="address"
                                onChange={handleInputChange}
                              />
                              <Typography
                                component="label"
                                variant="body1"
                                fontWeight={"bold"}
                                sx={{ alignSelf: "flex-start" }}
                                gutterBottom
                              >
                                Birth date
                              </Typography>
                              <TextField
                                type="date"
                                value={
                                  user.birthday
                                    ? new Date(user.birthday)
                                        .toISOString()
                                        .split("T")[0]
                                    : ""
                                } // Kiểm tra giá trị birthday
                                name="birthday"
                                onChange={handleInputChange}
                              />

                              <Typography
                                component="label"
                                variant="body1"
                                fontWeight={"bold"}
                                sx={{ alignSelf: "flex-start" }}
                                gutterBottom
                              >
                                Email
                              </Typography>
                              <TextField
                                type="email"
                                value={user.email}
                                name="email"
                                onChange={handleInputChange}
                              />
                              <Typography
                                component="label"
                                variant="body1"
                                fontWeight={"bold"}
                                sx={{ alignSelf: "flex-start" }}
                                gutterBottom
                              >
                                Phone number
                              </Typography>
                              <TextField
                                type="tel"
                                value={user.numberphone}
                                name="numberphone"
                                onChange={handleInputChange}
                              />
                            </FormControl>
                          </Box>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                          >
                            Save and close
                          </Button>
                        </DialogActions>
                      </form>
                    </Dialog>
                  </Box>
                  <Avatar
                    sx={{ width: 100, height: 100, margin: "0 auto" }}
                    src={oldUser.avt}
                    alt="Profile Picture"
                  />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {oldUser.name}
                  </Typography>
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }}>
                    Share profile link
                  </Button>
                  <Button variant="text" fullWidth sx={{ mt: 1 }}>
                    Update profile visibility
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={9}>
              {/* Experience Section */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6">Experience</Typography>
                <Divider sx={{ mt: 1, mb: 2 }} />
                {/* Projects */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1">Projects</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Showcase your skills to recruiters with job-relevant
                    projects.
                  </Typography>
                  <Button variant="text" sx={{ mt: 1 }}>
                    Browse Projects
                  </Button>
                </Box>
                {/* Work History */}
                <Box>
                  <Typography variant="subtitle1">Work history</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Add your past work experience here. If you’re just starting
                    out, you can add internships or volunteer experience
                    instead.
                  </Typography>
                  <Button variant="outlined" sx={{ mt: 1 }}>
                    + Add work experience
                  </Button>
                </Box>
              </Paper>

              {/* Education Section */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Education</Typography>
                <Divider sx={{ mt: 1, mb: 2 }} />
                <Box>
                  <Typography variant="subtitle1">Credentials</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Add your education and credentials here.
                  </Typography>
                  <Button variant="outlined" sx={{ mt: 1 }}>
                    + Add credentials
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default UserProfile;
