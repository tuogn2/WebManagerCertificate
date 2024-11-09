import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  Grid,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  TextField,
  InputAdornment,
  Pagination,
} from "@mui/material";
import PropTypes from "prop-types";
import { API_BASE_URL } from "../../utils/constants";
import AddCoursePage from "./AddCoursePage";
import axios from "axios";
import { Card } from "@mui/material";
import { useSelector } from "react-redux";
import CourseDetailsModal from "../../components/CourseDetailsModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from '@mui/icons-material/Search';

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

export default function CoursePage() {
  const [value, setValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCourses();
  }, [user, page]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/course/organization/${user.id || user._id}`,
        {
          params: { page, limit: 6 }, // Thêm tham số phân trang
        }
      );
      console.log(response.data);
      // Kiểm tra nếu không có khóa học
      if (response.data.message === "No courses found for this organization") {
        setCourses([]); // Cập nhật courses là mảng rỗng nếu không tìm thấy khóa học
        setTotalPages(0); // Đặt tổng số trang về 0
        return; // Không tiếp tục thực hiện các thao tác khác
      }
  
      setCourses(response?.data?.courses);
      setTotalPages(response.data.totalPages); // Cập nhật tổng số trang
    } catch (error) {
      // Kiểm tra nếu lỗi không phải là 'No courses found'
      if (
        error.response &&
        error.response.data.message !== "No courses found for this organization"
      ) {
        console.error("Error fetching courses!", error);
        toast.error("Failed to fetch courses.");
      }
    } finally {
      setLoading(false);
    }
  };
 

  const handleSearch = async () => {
    if (!searchTerm) {
      toast.warn("Please enter a search term.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/course/search`, {
        params: { query: searchTerm },
      });
      setCourses(response.data.courses);
      setTotalPages(1); // Reset total pages when searching
      setPage(1); // Reset to the first page
    } catch (error) {
      console.error("Error searching courses!", error);
      toast.error("Failed to search courses.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchTerm(""); // Clear the search input
    setPage(1); // Reset to the first page
    fetchCourses(); // Re-fetch the original list of courses
  };

  const handleOpenModal = (course) => {
    setSelectedCourse(course);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedCourse(null);
  };

  const handleDelete = async (courseId) => {
    setCourseToDelete(courseId);
    setConfirmDeleteOpen(true);
  };
  const token = localStorage.getItem('token');
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/course/${courseToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },});
      toast.success("Course deleted successfully!");
      setCourses(courses.filter((course) => course._id !== courseToDelete));
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error(error.response?.data.message || "Unknown error");
    } finally {
      setConfirmDeleteOpen(false);
      setCourseToDelete(null);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          aria-label="Course management tabs"
        >
          <Tab label="View Courses List" {...a11yProps(0)} />
          <Tab label="Add Course" {...a11yProps(1)} />
        </Tabs>
      </Box>

      {/* Search Input */}
      <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
        <TextField
          label="Search Courses"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, mr: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" onClick={handleRefresh} sx={{ ml: 2 }}>
          Refresh
        </Button>
      </Box>

      {/* View Courses Tab */}
      <TabPanel value={value} index={0}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {courses && courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: 4,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 8,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={course.image}
                    alt={course.title}
                    sx={{ borderRadius: "4px 4px 0 0" }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {course.title}
                      <span
                        style={{
                          color: course.isActive ? "green" : "red",
                          marginLeft: "10px",
                        }}
                      >
                        {course.isActive ? " (Approved)" : " (Pending Approval)"}
                      </span>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {course.description}
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      borderTop: "1px solid #e0e0e0",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenModal(course)}
                    >
                      View Course
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(course._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Pagination */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>

        {/* Modal for course details */}
        {selectedCourse && (
          <CourseDetailsModal
            modalOpen={open}
            handleCloseModal={handleCloseModal}
            selectedCourse={selectedCourse}
          />
        )}
      </TabPanel>

      {/* Add Course Tab */}
      <TabPanel value={value} index={1}>
        <AddCoursePage />
      </TabPanel>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this course?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Box>
  );
}
