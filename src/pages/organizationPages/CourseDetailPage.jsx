import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../utils/constants";
import { People } from "@mui/icons-material";

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch course details by ID
    axios
      .get(`${API_BASE_URL}/course/${id}`)
      .then((response) => {
        setCourse(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!course) {
    return <Typography>No course found</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {course.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {course.description}
        </Typography>
        <Chip
          icon={<People />}
          label={`${course.participantsCount} Participants`}
        />
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/courses/edit/${course._id}`)}
          >
            Edit Course
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={2}>
        {course.documents.map((doc, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{doc.title}</Typography>
              <Typography variant="body2">{doc.content}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
