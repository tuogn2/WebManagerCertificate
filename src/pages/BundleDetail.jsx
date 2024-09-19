import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Typography,
  Container,
  CssBaseline,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
} from "@mui/material";
import Header from "../components/Header";

const BundleDetail = () => {
  const { id } = useParams(); // Get the id from the URL
  const bundles = useSelector((state) => state.courses.courseBundles); // Get the list of bundles from Redux state
  const { user } = useSelector((state) => state.auth); // Get the user from the Redux state
  console.log("User:", user);
  // Find the bundle that matches the id from the URL params
  const bundle = bundles.find((bundle) => bundle._id === id);

  // If the bundle is not found, display a loading message
  if (!bundle) {
    return (
      <Container>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  // Function to check if a course is enrolled by the user
  const getEnrollmentStatus = (courseId) => {
    const enrollment = user.enrollments.find(
      (enrollment) => enrollment.course === courseId
    );
    return enrollment;
  };
  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: "2rem" }}>
        <Typography variant="h4" gutterBottom>
          {bundle.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {bundle.description}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Organization: {bundle.organization.name}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Address: {bundle.organization.address}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Email: {bundle.organization.email}
        </Typography>
        <img
          src={bundle.image}
          alt={bundle.title}
          style={{
            maxWidth: "100%",
            height: "auto",
            marginBottom: "20px",
            borderRadius: "8px",
          }}
        />

        <Typography variant="h5" gutterBottom>
          Courses in this Bundle:
        </Typography>
        <Grid container spacing={4}>
          {bundle.courses.map((course) => {
            const enrollment = getEnrollmentStatus(course._id);

            return (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={course.image}
                    alt={course.title}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {course.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      paragraph
                    >
                      {course.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Price: ${course.price}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Participants: {course.participantsCount}
                    </Typography>

                    {enrollment && (
                      <>
                        <Typography variant="body2" color="primary">
                          Progress: {enrollment.progress}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={enrollment.progress}
                          style={{ marginBottom: "10px" }}
                        />
                        {enrollment.completed && (
                          <Typography
                            variant="body2"
                            color="success.main"
                            gutterBottom
                          >
                            Completed
                          </Typography>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
};

export default BundleDetail;
