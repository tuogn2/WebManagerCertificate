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
import getCertificatesByStudentId from "../utils/getCertificatesByStudentId";
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
    return <Loading />; // Loading state
  }
  console.log(user._id);
  getCertificatesByStudentId(user._id).then((response) => {
    if (response.success) {
      console.log(response.data);
    }
  });

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
            <Grid container spacing={3} sx={{ mt: 4 }}>
              {courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
                  <Card
                    sx={{
                      position: "relative",
                      boxShadow: 3,
                      borderRadius: 2,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => navigate(`/course/${course._id}`)}
                      sx={{ position: "relative" }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={course.image}
                        alt={course.title}
                        sx={{
                          filter: "brightness(0.85)",
                          transition: "filter 0.3s",
                          "&:hover": {
                            filter: "brightness(1)",
                          },
                        }}
                      />
                      <CardContent
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          background: "rgba(0, 0, 0, 0.5)",
                          color: "#fff",
                          width: "100%",
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ fontWeight: "bold", mb: 1 }}
                        >
                          {course.title}
                        </Typography>
                        <Typography variant="body2">
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
                    <CardActionArea
                      onClick={() => navigate(`/bundle/${bundle._id}`)}
                    >
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
