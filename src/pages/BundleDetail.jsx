import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
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
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import payForCourse from "../utils/payForCourse";

const BundleDetail = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [bundle, setBundle] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // Set loading to true initially

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        console.log(id)
        const response = await axios.get(`${API_BASE_URL}/coursebundles/getid/${id}`);
         console.log(response.data)
        setBundle(response.data); // Set the fetched bundle
      } catch (error) {
        console.error("Error fetching bundle:", error);
        setMessage("Failed to load bundle details. Please try again.");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchBundle();
  }, [id]);

  const hasCertificate = user?.certificates?.some(
    (certificate) => certificate?.bundle === id
  );

  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  if (!bundle) {
    return (
      <Container>
        <Typography variant="h6">{message || "No bundle found."}</Typography>
      </Container>
    );
  }

  const getEnrollmentStatus = (courseId) => {
    if (!user || !user.enrollments) return null;
    return user.enrollments.find(
      (enrollment) => enrollment.course === courseId
    );
  };

  const canGetCertificate = () => {
    if (!user || !bundle.courses) return false;
    return bundle.courses.every((course) => {
      const enrollment = getEnrollmentStatus(course._id);
      return enrollment?.completed;
    });
  };

  const handleGetCertificate = async () => {
    setLoading(true);
    try {
      const studentId = user?._id || "guest"; // Handle guest user
      const studentName = user?.name || "Guest User"; // Default name for guest
      const amount = 0.000000001;
      const walletOr =
        bundle.organization.walletaddress ||
        "0x6087050c4069ab730d872e625E035A8fd8DeD600";
      const organization = bundle.organization.name;

      const paymentResult = await payForCourse(
        studentId,
        bundle._id,
        studentName,
        amount,
        walletOr,
        organization
      );

      if (paymentResult.success) {
        const enrollmentResponse = await axios.post(
          `${API_BASE_URL}/enrollment/createBundleEnrollment`,
          {
            user: studentId,
            bundle: bundle._id,
          }
        );

        if (enrollmentResponse.data) {
          const organizationId = bundle.organization._id;

          const response = await axios.post(
            `${API_BASE_URL}/certificates/createCertificateBunble`,
            {
              user: studentId,
              organization: organizationId,
              bunbles: bundle._id,
            }
          );
          setMessage("Certificate has been successfully issued!");
          navigate("/");
        }
      } else {
        setMessage(
          paymentResult.message || "Payment failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error in getting certificate:", error);
      setMessage("Failed to get certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  };
console.log(bundle)
  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: "2rem", marginBottom: "10px" }}>
        {loading && <CircularProgress />}
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          alignItems="flex-start"
          justifyContent="space-between"
          mb={4}
        >
          <Box flex={1} mr={{ md: 2 }}>
            <img
              src={bundle.image}
              alt={`Image of ${bundle.title}`}
              style={{
                maxWidth: "300px",
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Box>
          <Box flexShrink={0} mt={{ xs: 2, md: 0 }}>
            <Typography variant="h4" gutterBottom>
              {bundle.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {bundle.description}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Organization: {bundle?.organization?.name}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Address: {bundle?.organization?.address}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Email: {bundle.organization.email}
            </Typography>
            <Box mt={4}>
              <Button
                variant="contained"
                color="primary"
                disabled={!canGetCertificate() || hasCertificate || loading}
                onClick={handleGetCertificate}
                fullWidth
              >
                {hasCertificate
                  ? "You have already received the certificate"
                  : canGetCertificate()
                  ? "Get Certificate"
                  : "Complete All Courses to Get Certificate"}
              </Button>
              {hasCertificate && (
                <Typography variant="body2" color="success.main" mt={2}>
                  You have already received the certificate for this bundle.
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
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
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={course.image}
                    alt={`Image of ${course.title}`}
                    style={{ borderRadius: "8px 8px 0 0" }}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
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
                          style={{ marginBottom: "10px", height: "8px" }}
                        />
                        {enrollment.completed ? (
                          <Typography
                            variant="body2"
                            color="success.main"
                            gutterBottom
                          >
                            Completed
                          </Typography>
                        ) : (
                          <Typography
                            variant="body2"
                            color="error.main"
                            gutterBottom
                          >
                            Not completed
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
        {message && <Typography color="error.main">{message}</Typography>}
      </Container>
      <Footer />
    </>
  );
};

export default BundleDetail;
