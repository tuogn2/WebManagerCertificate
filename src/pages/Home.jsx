import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  getAllCourses,
  getAllCourseBundles,
} from "../store/slices/courseSlice"; // Import thunks
import Loading from "../components/Loading";
import Banner from "../components/Banner";
import CourseList from "../components/CourseList";
import CourseBundles from "../../../rush/WebManagerCertificate/src/pages/organizationPages/CourseBundles";
import CourseBundleList from "../components/CourseBundleList";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const courses = useSelector((state) => state.courses.courses);
  const courseBundles = useSelector((state) => state.courses.courseBundles);
  const loading = useSelector((state) => state.courses.loading);

  // useEffect(() => {
  //   // dispatch(getAllCourses()); // Fetch courses
  //   // dispatch(getAllCourseBundles()); // Fetch course bundles
  // }, [user, navigate, dispatch]);

  if (loading) {
    return <Loading />; // Loading state
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" style={{ marginBottom: "10px" }}>
        <Grid spacing={1}>
          <div style={{ marginTop: "40px" }}>
            <Banner />
          </div>

          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Available Courses
            </Typography>
          <CourseList/>
            


            <Typography variant="h4" component="h1" gutterBottom mt={15}>
              Available Course Bundles
            </Typography>
            <CourseBundleList/>

          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default Home;
