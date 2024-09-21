import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Grid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../utils/constants";

export default function EditCoursePage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch course details
    axios
      .get(`${API_BASE_URL}/course/${id}`)
      .then((response) => {
        setCourse(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          price: response.data.price,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update course
    axios
      .put(`${API_BASE_URL}/course/${id}`, formData)
      .then((response) => {
        navigate(`/courses/${id}`);
      })
      .catch((error) => {
        console.error("Error updating course:", error);
      });
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Course
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
