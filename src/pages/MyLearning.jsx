import React, { useEffect, useState } from "react";
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
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MyLearning = () => {
  const [tabValue, setTabValue] = useState(0); // 0: All, 1: Courses, 2: Bundles
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortOption, setSortOption] = useState(""); // Sort options: "", "alphabetical", "enrolledAt", "completed"
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

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/enrollment/userHaveBunbleAndCourse/${user._id || user.id}`
      );
      setEnrollment(response.data);
    } catch (error) {
      console.error("Error fetching courses: ", error);
    }
  };

  const sortEnrollments = (enrollments) => {
    let sortedEnrollments = [...enrollments];
    switch (sortOption) {
      case "alphabetical":
        sortedEnrollments.sort(
          (a, b) =>
            a.bundle?.title.localeCompare(b.bundle?.title || "") ||
            a.course?.title.localeCompare(b.course?.title || "")
        );
        break;
      case "enrolledAt":
        sortedEnrollments.sort(
          (a, b) => new Date(a.enrolledAt) - new Date(b.enrolledAt)
        );
        break;
      case "completed":
        sortedEnrollments = sortedEnrollments.filter(
          (enrollment) => enrollment.completed ===true
        );
        break;
        case "uncompleted":
        sortedEnrollments = sortedEnrollments.filter(
          (enrollment) => enrollment.completed ===false
        );
        break;
      default:
        break;
    }
    return sortedEnrollments;
  };

  const renderTabContent = () => {
    const filteredEnrollments =
      tabValue === 0
        ? enrollments // All
        : tabValue === 1
          ? enrollments.filter((enrollment) => enrollment.bundle === undefined) // Courses
          : enrollments.filter((enrollment) => enrollment.bundle !== undefined); // Bundles

    const sortedEnrollments = sortEnrollments(filteredEnrollments);

    return (
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {sortedEnrollments.map((enrollment) => (
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
                  navigate(
                    enrollment.bundle
                      ? `/bundle/${enrollment.bundle._id}`
                      : `/course/${enrollment.course._id}`
                  )
                }
              >
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      enrollment.bundle
                        ? enrollment.bundle.image
                        : enrollment.course.image
                    }
                    alt="Course or Bundle Image"
                    sx={{ borderRadius: "4px 4px 0 0" }}
                  />

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
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {enrollment.bundle
                      ? enrollment.bundle.title
                      : enrollment.course.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ mb: 1 }}
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3, // Limit to 3 lines
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      height: "4.5em", // Adjust height according to your line-height
                    }}
                  >
                    {enrollment.bundle
                      ? enrollment.bundle.description
                      : enrollment.course.description}
                  </Typography>

                  <Typography variant="caption" color="textSecondary">
                    Enrolled on:{" "}
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color={enrollment.completed ? "green" : "red"}>
                    {enrollment.completed ? "Completed" : "Not Completed"}
                  </Typography>
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleMenuClose}>Option 1</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Option 3</MenuItem>
                  </Menu>

                 
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
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
                display: "flex",
                alignItems: "center",
                p: 2,
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="Learning Tabs"
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="All" />
                <Tab label="Courses" />
                <Tab label="Bundles" />
              </Tabs>
              <FormControl sx={{ ml: 2, minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortOption}
                  onChange={handleSortChange}
                  label="Sort By"
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="alphabetical">Alphabetical</MenuItem>
                  <MenuItem value="enrolledAt">Enrolled Date</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="uncompleted">Dont completed</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {renderTabContent()}
          </Paper>
        </Container>
      </Container>
      <Footer />
    </>
  );
};

export default MyLearning;
