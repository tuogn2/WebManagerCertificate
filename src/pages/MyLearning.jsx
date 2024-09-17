import React from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  CssBaseline,
  AppBar,
  Toolbar,
  Container,
  CardActionArea,
  Divider,
  Paper,
  LinearProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MyLearning = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const [enrollments, setEnrollment] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Get all cousres which the user is enrolled in
  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/enrollment/user/${user.id}`
      );
      console.log(user.id);

      setEnrollment(response.data);
    } catch (error) {
      console.error("Error fetching courses: ", error);
    }
  };

  // Function to render content based on the selected tab
  const renderTabContent = () => {
    switch (tabValue) {
      case 0:
        return (
          <>
            {/* Course List */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
              {enrollments.map((enrollment) => (
                <Grid item xs={12} sm={6} md={4} key={enrollment.id}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() =>
                        navigate(`/course/${enrollment.course._id}`)
                      }
                    >
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={enrollment.course.image}
                          alt="Course Image"
                          sx={{ borderRadius: "4px 4px 0 0" }}
                        />

                        {/* IconButton in the top-right corner of CardMedia */}
                        <IconButton
                          aria-label="settings"
                          onClick={handleMenuClick}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "white",
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.8)",
                            },
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>

                      <CardContent sx={{ padding: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          {enrollment.course.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mb: 1 }}
                        >
                          {enrollment.course.description}
                        </Typography>
                        <Menu
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={handleMenuClose}>
                            Option 1
                          </MenuItem>
                          <MenuItem onClick={handleMenuClose}>
                            Option 2
                          </MenuItem>
                          <MenuItem onClick={handleMenuClose}>
                            Option 3
                          </MenuItem>
                        </Menu>
                        {/* Progress Bar */}
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="textSecondary">
                            Progress: {enrollment.progress}%
                          </Typography>
                          <LinearProgress
                            variant="buffer"
                            value={enrollment.progress}
                            sx={{ height: 8, borderRadius: 5 }}
                          />
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
              {/* Add more course cards as needed */}
            </Grid>
          </>
        );
      case 1:
        return <Typography variant="h6">My Lists Content</Typography>;
      case 2:
        return <Typography variant="h6">Wishlist Content</Typography>;
      case 3:
        return <Typography variant="h6">Archived Content</Typography>;
      case 4:
        return <Typography variant="h6">Learning Tools Content</Typography>;
      default:
        return null;
    }
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>
      <Container maxWidth={"xl"}>
        <Box mt={3}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "Highlight",
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            My Learning
          </Typography>
          <Divider variant="middle" />
        </Box>
        <Container maxWidth={"lg"}>
          <Paper>
            <Box
              sx={{
                position: "sticky",
                top: 64,
                zIndex: 1000,
                backgroundColor: "white",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Learning Tabs"
                indicatorColor="primary" // Optional: add color to the active tab
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="All courses" />
                <Tab label="My Lists" />
                <Tab label="Wishlist" />
                <Tab label="Archived" />
                <Tab label="Learning tools" />
              </Tabs>
            </Box>

            {/* Render Content Based on Selected Tab */}
            {renderTabContent()}
          </Paper>
        </Container>
      </Container>
      <Footer />
    </>
  );
};

export default MyLearning;
