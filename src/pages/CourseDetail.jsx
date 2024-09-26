import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  Box,
  Button,
  AppBar,
  Toolbar,
  CssBaseline,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants.jsx";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NotFound from "./NotFound";
import Loading from "../components/Loading.jsx";
import { useSelector, useDispatch } from "react-redux";
import { addEnrollmentToUser } from "../store/slices/authSlice";
import payForCourse from "../utils/payForCourse";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // New state for processing
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const walletAddress = useSelector((state) => state.wallet.address);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/course/${id}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Failed to fetch course data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!course) {
    return <NotFound />;
  }

  const hasEnrolled = user?.enrollments.some((enrollment) => {
    if (!enrollment.course) return false;
    return enrollment.course.toString() === course._id;
  });

  const handleButtonClick = async () => {
    if (!user) {
      setMessage("You must be logged in to enroll in a course.");
      navigate("/login");
      return;
    }

    if (hasEnrolled) {
      navigate(`/course/${id}/learn`);
    } else {
      try {
        if (!walletAddress) {
          setMessage("Please create a wallet to enroll in the course.");
          return;
        }

        setIsProcessing(true); // Start processing
        const studentId = user._id; 
        const studentName = user.name; 
        const amount =
          course.price === 0
            ? 0.000000001
            : (course.price / 100000).toFixed(18); 
        const walletOr =
          course.organization.walletaddress ||
          "0x6087050c4069ab730d872e625E035A8fd8DeD600";
        const organization = course.organization.name;

        const paymentResult = await payForCourse(
          studentId,
          course._id,
          studentName,
          amount,
          walletOr,
          organization
        );

        if (paymentResult.success) {
          const response = await axios.post(`${API_BASE_URL}/enrollment`, {
            user: studentId,
            course: course._id,
          });

          console.log("Enrollment created successfully:", response.data);
          dispatch(addEnrollmentToUser(response.data));
          navigate(`/course/${id}/learn`);
        } else {
          setMessage(paymentResult.message);
        }
      } catch (error) {
        console.error("Failed to process payment or create enrollment:", error);
        setMessage("Failed to process payment or create enrollment. Please try again.");
      } finally {
        setIsProcessing(false); // End processing
      }
    }
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={course.image}
                alt={course.title}
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography paragraph>{course.description}</Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6">Details</Typography>
                    <Typography>Duration: {course.duration} hours</Typography>
                    <Typography>Price: ${course.price}</Typography>
                    <Typography>
                      Participants: {course.participantsCount}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color={hasEnrolled ? "secondary" : "primary"}
                    sx={{ mt: 2 }}
                    onClick={handleButtonClick}
                    disabled={isProcessing} // Disable button while processing
                  >
                    {isProcessing ? <CircularProgress size={24} color="inherit" /> : (hasEnrolled ? "Go to Course" : "Join Course")}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Course Sections
                </Typography>
                {course.documents.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">{item.title}</Typography>
                    <Typography variant="body2">
                      {item.content || "No content available"}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {course.organization && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Provided by
                  </Typography>
                  <Typography variant="subtitle1">
                    {course.organization.name}
                  </Typography>
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.organization.avatar}
                    alt={course.organization.name}
                    sx={{ borderRadius: 1, mb: 2 }}
                  />
                  <Typography>
                    Address: {course.organization.address}
                  </Typography>
                  <Typography>Email: {course.organization.email}</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
      <Footer />
      {message && (
        <Snackbar
          open={Boolean(message)}
          autoHideDuration={6000}
          onClose={() => setMessage("")}
        >
          <Alert
            onClose={() => setMessage("")}
            severity="error"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default CourseDetail;
