import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Grid, AppBar, CssBaseline, Button } from "@mui/material";
import { API_BASE_URL } from "../utils/constants";
import Header from "../components/Header";

const DetailTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/test/${id}`);
        setTest(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch test details.");
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [id]);

  const handleTakeTest = () => {
    navigate(`/take-test/${id}`); // Điều hướng đến trang kiểm tra
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!test) {
    return <Typography>No test found.</Typography>;
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Header />
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "white",
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          mt: 4,
          mb: 4,
        }}
      >
        <Grid container spacing={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <Typography variant="h4" gutterBottom>
                {test.title}
              </Typography>
              {test.description ? (
                <Typography>Description: {test.description}</Typography>
              ) : (
                <Typography>No description available</Typography>
              )}
              {test.price !== undefined ? (
                <Typography>
                  Price: {test.price === 0 ? "Free" : `$${test.price}`}
                </Typography>
              ) : (
                <Typography>No price information</Typography>
              )}
              {test.passingScore !== undefined ? (
                <Typography>Passing Score: {test.passingScore}</Typography>
              ) : (
                <Typography>No passing score information</Typography>
              )}
              {test.participantsCount !== undefined ? (
                <Typography>Participants: {test.participantsCount}</Typography>
              ) : (
                <Typography>No participants count information</Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleTakeTest}
                sx={{ mt: 2 }}
              >
                Kiểm Tra
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              {test.image ? (
                <img
                  src={test.image}
                  alt={test.title}
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              ) : (
                <Typography>No image available</Typography>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Thông tin tổ chức</Typography>
            {test.organization?.name ? (
              <Typography>Tên: {test.organization.name}</Typography>
            ) : (
              <Typography>No organization name available</Typography>
            )}
            {test.organization?.address ? (
              <Typography>Địa chỉ: {test.organization.address}</Typography>
            ) : (
              <Typography>No organization address available</Typography>
            )}
            {test.organization?.email ? (
              <Typography>Email: {test.organization.email}</Typography>
            ) : (
              <Typography>No organization email available</Typography>
            )}
            {test.organization?.avatar ? (
              <img
                src={test.organization.avatar}
                alt={test.organization.name}
                style={{ width: "100%", borderRadius: "8px" }}
              />
            ) : (
              <Typography>No organization avatar available</Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default DetailTest;
