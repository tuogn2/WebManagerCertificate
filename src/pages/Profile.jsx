import React, { useState } from "react";
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
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Header from "../components/Header";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Typography variant="h6">No user data available</Typography>;
  }

  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const formattedBirthday = new Date(user.birthday).toISOString().split("T")[0];

  const [location, setLocation] = useState("");
  const [pronouns, setPronouns] = useState("");

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handlePronounsChange = (event) => {
    setPronouns(event.target.value);
  };

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
                            src={user.avt}
                          />
                          <Typography variant="subtitle1" sx={{ mt: 2 }}>
                            Profile Photo
                          </Typography>
                          <Box
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <Button variant="contained" sx={{ mt: 1, mr: 1 }}>
                              Change photo
                            </Button>
                            <Button variant="outlined" sx={{ mt: 1 }}>
                              Remove photo
                            </Button>
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
                              <Typography
                                component="span"
                                sx={{
                                  color: "grey.600",
                                  fontStyle: "italic",
                                  marginLeft: "4px",
                                }}
                              >
                                (Required)
                              </Typography>
                            </Typography>

                            <TextField type="text" value={user.name} />
                            <Typography
                              component="label"
                              variant="body1"
                              fontWeight={"bold"}
                              sx={{ alignSelf: "flex-start" }}
                              gutterBottom
                            >
                              Location
                            </Typography>
                            <TextField value={user.address} />
                            <Typography
                              component="label"
                              variant="body1"
                              fontWeight={"bold"}
                              sx={{ alignSelf: "flex-start" }}
                              gutterBottom
                            >
                              Birth date
                            </Typography>
                            <TextField type="date" value={formattedBirthday} />
                            <Typography
                              component="label"
                              variant="body1"
                              fontWeight={"bold"}
                              sx={{ alignSelf: "flex-start" }}
                              gutterBottom
                            >
                              Email
                            </Typography>
                            <TextField type="email" value={user.email} />
                            <Typography
                              component="label"
                              variant="body1"
                              fontWeight={"bold"}
                              sx={{ alignSelf: "flex-start" }}
                              gutterBottom
                            >
                              Phone number
                            </Typography>
                            <TextField type="tel" value={user.numberphone} />
                          </FormControl>
                        </Box>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={handleModalClose}
                          color="primary"
                          variant="contained"
                        >
                          Save and close
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Box>
                  <Avatar
                    sx={{ width: 100, height: 100, margin: "0 auto" }}
                    src={user.avt}
                    alt="Profile Picture"
                  />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {user.name}
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
