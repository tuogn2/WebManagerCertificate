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
              <Grid item xs={12} md={4} key={course._id}>
                <Paper
                  sx={{
                    p: 4,
                    width: "400px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                  }}
                >
                  <Typography variant="h6">{course.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
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
            <>
              <Typography variant="h6" gutterBottom>
                Course Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="h6">
                Title: {selectedCourse.title}
              </Typography>
              <Typography variant="body1">
                Description: {selectedCourse.description}
              </Typography>
              <Typography variant="body1">
                Price: ${selectedCourse.price}
              </Typography>
              <Typography variant="body1">
                Organization: {selectedCourse.organization.name}
              </Typography>

              <Typography variant="h6" sx={{ mt: 3 }}>
                Documents
              </Typography>
              <List>
                {selectedCourse.documents.map((doc) => (
                  <ListItem key={doc._id}>
                    <ListItemText primary={doc.title} secondary={doc.content} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" sx={{ mt: 3 }}>
                Final Quiz
              </Typography>
              {selectedCourse.finalQuiz && (
                <Stack spacing={2}>
                  <Typography variant="body1">
                    Title: {selectedCourse.finalQuiz.title}
                  </Typography>
                  {selectedCourse.finalQuiz.questions.map((question) => (
                    <Box
                      key={question._id}
                      sx={{ border: "1px solid", borderRadius: 1, p: 2, mb: 2 }}
                    >
                      <Typography variant="body1">
                        {question.questionText}
                      </Typography>
                      {question.options.map((option) => (
                        <Typography
                          key={option._id}
                          variant="body2"
                          sx={{ ml: 2 }}
                        >
                          - {option.text}
                        </Typography>
                      ))}
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Correct Answer: {question.correctAnswer}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}

              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleCloseModal}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default ConfirmCourse;
