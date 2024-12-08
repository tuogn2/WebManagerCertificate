import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Pagination,
} from "@mui/material";
import { API_BASE_URL } from "../../utils/constants";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CourseBundles = () => {
  const { user } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [courseBundles, setCourseBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    selectedCourses: [],
    image: null,
  });
  const [open, setOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [bundleToDelete, setBundleToDelete] = useState(null);
  const token = localStorage.getItem('token');
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchCourseBundles = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/coursebundles/${user.id || user._id}`
      );
      console.log(response.data);
      setCourseBundles(response.data);
    } catch (error) {
      console.error("Có lỗi khi lấy danh sách bundle khóa học!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/course/organization/${user.id || user._id}?full=true`
        );
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Có lỗi khi lấy danh sách khóa học!", error);
      }
    };

    fetchCourses();
    fetchCourseBundles();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (formData.selectedCourses.length < 2) {
      toast.error("Vui lòng chọn ít nhất 2 khóa học.");
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("courses", JSON.stringify(formData.selectedCourses));
    data.append("organization", user.id || user._id);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (editingBundle) {
        await axios.put(
          `${API_BASE_URL}/coursebundles/${editingBundle._id}`,
          data, {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào headers
            },}
        );
        toast.success("Cập nhật bundle khóa học thành công!");
      } else {
        await axios.post(`${API_BASE_URL}/coursebundles`, data,{
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào headers
          },
        });
        toast.success("Tạo bundle khóa học thành công!");
      }
      resetForm();
      setOpen(false);
      fetchCourseBundles();
    } catch (error) {
      toast.error("Có lỗi khi tạo/cập nhật bundle khóa học.");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (bundle) => {
    setEditingBundle(bundle);
    setFormData({
      title: bundle.title,
      description: bundle.description,
      selectedCourses: bundle.courses.map((course) => course._id),
      image: null,
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    setBundleToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/coursebundles/${bundleToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào headers
        },});
      toast.success("Xóa bundle khóa học thành công!");
      fetchCourseBundles();
    } catch (error) {
      toast.error("Có lỗi khi xóa bundle khóa học.");
      console.error("Error:", error);
    } finally {
      setConfirmDeleteOpen(false);
      setBundleToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      selectedCourses: [],
      image: null,
    });
    setEditingBundle(null);
  };

  const handleClickOpen = () => {
    resetForm();
    setOpen(true);
  };

  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const filteredBundles = courseBundles.filter((bundle) =>
    bundle.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastBundle = currentPage * itemsPerPage;
  const indexOfFirstBundle = indexOfLastBundle - itemsPerPage;
  const currentBundles = filteredBundles.slice(
    indexOfFirstBundle,
    indexOfLastBundle
  );
  const totalPages = Math.ceil(filteredBundles.length / itemsPerPage);

  if (loading) {
    return <CircularProgress />;
  }
  return (
    <Container sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bundle Khóa Học
      </Typography>

      <TextField
        label="Tìm Kiếm"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleClickOpen}
        sx={{ mb: 3 }}
      >
        Tạo Bundle Khóa Học
      </Button>

      {/* Dialog for Creating/Updating Bundles */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingBundle ? "Cập Nhật Bundle Khóa Học" : "Tạo Bundle Khóa Học"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Tiêu Đề"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Mô Tả"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              multiline
              rows={4}
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth required sx={{ mb: 2 }}>
            
              <InputLabel>Khóa Học</InputLabel>
              <Select
                multiple
                value={formData.selectedCourses}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    selectedCourses: e.target.value,
                  }))
                }
                renderValue={(selected) =>
                  selected
                    .map((id) => {
                      const course = courses.find(
                        (course) => course._id === id
                      );
                      return course ? course.title : "";
                    })
                    .join(", ")
                }
              >
                {Array.isArray(courses) && courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
            />

            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={handleClose} color="secondary">
                Hủy
              </Button>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                {editingBundle ? "Cập Nhật" : "Tạo Bundle"}
                {isSubmitting && (
                  <CircularProgress size={24} sx={{ ml: 1 }} />
                )}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa bundle khóa học này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} color="secondary">
            Hủy
          </Button>
          <Button onClick={confirmDelete} color="primary">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Course Bundle Cards */}
      <Grid container spacing={2}>
        {currentBundles.map((bundle) => (
          <Grid item xs={12} sm={6} md={4} key={bundle._id}>
            <Card>
              <CardMedia
                component="img"
                alt={bundle.title}
                height="140"
                image={bundle.image || "default-image-url.jpg"} // Set a default image URL
              />
              <CardContent>
                <Typography variant="h5" component="div" style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}> 
                  {bundle.title}
                </Typography>
                <Typography variant="body2" color="text.secondary"  style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3, // Limit to 3 lines
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      height: "4.5em", // Adjust height according to your line-height
                    }}>
                  {bundle.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEdit(bundle)}
                  sx={{ mt: 2 }}
                >
                  Chỉnh Sửa
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(bundle._id)}
                  sx={{ mt: 2, ml: 1 }}
                >
                  Xóa
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handleChangePage}
        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
      />
      <ToastContainer />
    </Container>
  );
};

export default CourseBundles;
