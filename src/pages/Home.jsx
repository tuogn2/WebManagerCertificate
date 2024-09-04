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
import { getAllCourses, getAllCourseBundles } from "../store/slices/courseSlice"; // Import thunks
import Loading from "../components/Loading";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const courses = useSelector((state) => state.courses.courses);
  const courseBundles = useSelector((state) => state.courses.courseBundles);
  const loading = useSelector((state) => state.courses.loading);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      dispatch(getAllCourses()); // Fetch courses
      dispatch(getAllCourseBundles()); // Fetch course bundles
    }
  }, [user, navigate, dispatch]);

  if (loading) {
    return <Loading/>; // Loading state
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom mt={15}>
              Available Courses
            </Typography>
            <Grid container spacing={2}>
              {courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
                  <Card>
                    <CardActionArea onClick={() => navigate(`/course/${course._id}`)}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={course.image} // Assuming course has an image field
                        alt={course.title}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {course.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {course.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h4" component="h1" gutterBottom mt={15}>
              Available Course Bundles
            </Typography>
            <Grid container spacing={2}>
              {courseBundles.map((bundle) => (
                <Grid item xs={12} sm={6} md={4} key={bundle._id}>
                  <Card>
                    <CardActionArea onClick={() => navigate(`/bundle/${bundle._id}`)}>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {bundle.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {bundle.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default Home;
