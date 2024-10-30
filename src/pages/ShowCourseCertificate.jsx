import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  Grid,
  CssBaseline,
  AppBar,
  Toolbar,
  Container,
  CardMedia,
  Avatar,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";

const ShowCourseCertificate = () => {
  const location = useLocation();
  const certificate = location.state;
  const user = useSelector((state) => state.auth.user);
  console.log(certificate, user);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(certificate.issueDate));

  console.log(formattedDate); // Output: "September 29, 2024"

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mb: 20, mt: 5 }}>
        <Typography variant="caption" gutterBottom>
          Course Certificate
        </Typography>
        {/* Course Title */}
        <Typography variant="h4" gutterBottom>
          {certificate?.course
            ? certificate.course.title
            : certificate.bundle.title}
        </Typography>
        <Grid container spacing={2}>
          {/* Left Side */}
          <Grid item xs={12} md={6}>
            {/* Course Completion Section */}
            <Card
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                padding: "20px",
                backgroundColor: "#d6edf6",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex" }}>
                <Avatar src={user?.avt} sx={{ width: 50, height: 50 }} />
                <Box sx={{ marginLeft: "20px" }}>
                  <Typography variant="h6">
                    Completed by {user?.name}
                  </Typography>
                  <Typography variant="body2">{formattedDate}</Typography>
                </Box>
              </Box>
              <CheckCircleOutlineIcon fontSize="large" color="success" />
            </Card>

            {/* Course Description Section */}
            <Box sx={{ marginTop: "20px" }}>
              <Typography variant="h5">Description</Typography>
              <Typography variant="body1">
                {certificate.course.description}
              </Typography>
            </Box>

            {/* Skills Section */}
            <Box sx={{ marginTop: "20px" }}>
              <Typography variant="h5">About organization</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <Avatar
                  src={certificate.organization.avatar}
                  sx={{ width: 40, height: 40 }}
                />
                <Box>
                  <Typography variant="body1">
                    {certificate.organization.name}
                  </Typography>
                  <Typography variant="body1">
                    {certificate.organization.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Side */}
          <Grid item xs={12} md={6}>
            <Card sx={{ width: "100%" }}>
              <CardMedia
                component="img"
                height="100%"
                image={certificate.imageUrl}
                alt="Certificate"
              />
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </>
  );
};

export default ShowCourseCertificate;
