import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  Modal,
  Stack,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { API_BASE_URL } from "../../utils/constants";
import CourseDetailsModal from "../../components/CourseDetailsModal";

const ConfirmCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/course/inactive`);
        setCourses(response.data);
      } catch (error) {
        setError("Failed to fetch courses");
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleOpenModal = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setModalOpen(false);
  };

  const handleApprove = async (courseId) => {
    try {
      await axios.put(`${API_BASE_URL}/course/${courseId}/activate`);
      setCourses(courses.filter((course) => course._id !== courseId)); // Update the list
    } catch (error) {
      console.error("Error approving course:", error);
    }
  };

  const handleReject = async (courseId) => {
    try {
      await axios.delete(`${API_BASE_URL}/course/${courseId}`);
      setCourses(courses.filter((course) => course._id !== courseId)); // Update the list
    } catch (error) {
      console.error("Error rejecting course:", error);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="xl">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Courses Pending Approval
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {courses.length === 0 ? (
            <Typography>No courses pending approval</Typography>
          ) : (
            courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} lg={5} key={course._id}>
                <Paper
                  sx={{
                    p: 4,
                    width: "100%", // Full width of the grid item
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "space-between", // Add space between title/description and buttons
                    minHeight: "200px", // Ensure a minimum height
                    borderRadius: "8px", // Rounded corners for the card
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Light shadow for better appearance
                    overflow: "hidden", // Prevent overflow of content
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap", // Prevent title from breaking into multiple lines
                      overflow: "hidden",
                      textOverflow: "ellipsis", // Truncate long titles with ellipsis (...)
                      width: "100%",
                    }}
                  >
                    {course.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3, // Limit to 3 lines of text
                      overflow: "hidden", // Hide overflowing text
                      textOverflow: "ellipsis", // Show ellipsis for truncated text
                      mt: 1, // Margin top
                    }}
                  >
                    {course.description}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      mt: 2,
                      gap: 1, // Add space between buttons
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleOpenModal(course)}
                    >
                      Details
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleApprove(course._id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleReject(course._id)}
                    >
                      Reject
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="course-details-modal"
        aria-describedby="course-details-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            p: 4,
            width: "80vw", // Explicitly set width
            maxWidth: "700px", // Ensure maxWidth is respected
            maxHeight: "80vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {selectedCourse && (
            <CourseDetailsModal
              modalOpen={modalOpen}
              handleCloseModal={handleCloseModal}
              selectedCourse={selectedCourse}
            />
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default ConfirmCourse;
