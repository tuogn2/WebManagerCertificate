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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { API_BASE_URL } from "../../utils/constants";
import CourseDetailsModal from "../../components/CourseDetailsModal";

const ConfirmCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [courseToReject, setCourseToReject] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/course/inactive`);
        setCourses(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setCourses([]);
        } else {
          setError("Failed to fetch courses");
        }
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
  const token = localStorage.getItem('token');
  const handleApprove = async (courseId) => {
    try {
      await axios.put(`${API_BASE_URL}/course/${courseId}/activate`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },});
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error("Error approving course:", error);
    }
  };

  const handleRejectOpen = (courseId) => {
    setCourseToReject(courseId);
    setDialogOpen(true);
  };

  const handleRejectClose = () => {
    setDialogOpen(false);
    setCourseToReject(null);
  };

  const handleReject = async () => {
    try {
      if (courseToReject) {
        await axios.delete(`${API_BASE_URL}/course/${courseToReject}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào headers
          },});
        setCourses(courses.filter((course) => course._id !== courseToReject));
      }
    } catch (error) {
      console.error("Error rejecting course:", error);
    } finally {
      handleRejectClose();
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
            <Typography>No inactive courses found</Typography>
          ) : (
            courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} lg={5} key={course._id}>
                <Paper
                  sx={{
                    p: 4,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "space-between",
                    minHeight: "300px", // Set a fixed height
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    overflow: "hidden",
                  }}
                >
                  {course.image && (
                    <Box
                      component="img"
                      src={course.image}
                      alt={course.title}
                      sx={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "150px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "100%",
                      mt: 1,
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
                      WebkitLineClamp: 3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      mt: 1,
                    }}
                  >
                    {course.description}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      mt: 2,
                      gap: 1,
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
                      onClick={() => handleRejectOpen(course._id)}
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
            width: "80vw",
            maxWidth: "700px",
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

      {/* Confirmation Dialog for Rejecting Course */}
      <Dialog
        open={dialogOpen}
        onClose={handleRejectClose}
        aria-labelledby="confirm-reject-dialog"
      >
        <DialogTitle id="confirm-reject-dialog">Confirm Rejection</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to reject this course?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleReject} color="secondary">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConfirmCourse;
