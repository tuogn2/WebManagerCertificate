import React, { useEffect, useState } from "react";
import {
  Box,
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
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import NotFound from "./NotFound";
import getCertificatesByStudentId from "../utils/getCertificatesByStudentId";
import Loading from "../components/Loading";

const ShowCourseCertificate = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [certificate, setCertificate] = useState({});
  // const [certificateExists, setCertificateExists] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const certResponse = await axios.get(
          `${API_BASE_URL}/certificates/${id}`
        );
        setCertificate(certResponse.data);

        const userResponse = await axios.get(
          `${API_BASE_URL}/users/${certResponse.data.user._id}`
        );
        setUser(userResponse.data);
        // const additionalCertificates = await getCertificatesByStudentId(
        //   certResponse.data.user._id
        // );
        // console.log("Additional certificates:", additionalCertificates);
        // const duplicateExists = additionalCertificates.data.some((cert) => {
        //   console.log(
        //     "Checking:",
        //     cert.certificateId,
        //     certResponse.data.certificateId
        //   );
        //   return cert.certificateId === certResponse.data.certificateId;
        // });
        // setCertificateExists(duplicateExists);
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally {
        setLoading(false); // Set loading to false after API calls are done
    }
    };

    fetchCertificate();
  }, [id]);


  if (loading) {
    return <Loading/>
}

  if (!certificate.course && !certificate.bundle) {
    return <NotFound />;
  }

 
  if (!user._id) {
    return <NotFound />;
  }
  // if (certificateExists ===false) {
  //   return <> blockchain nothave</>
  // }

  // Function to format date safely
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available"; // Handle missing date
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid date"
      : new Intl.DateTimeFormat("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }).format(date);
  };

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
            : certificate.bundle?.title}
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
                    Completed by {user?.name || "Unknown User"}
                  </Typography>
                  <Typography variant="body2">
                    Srore: <b>{certificate.score}</b>
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(certificate.issueDate)}
                  </Typography>
                </Box>
              </Box>
              <CheckCircleOutlineIcon fontSize="large" color="success" />
            </Card>

            {/* Course Description Section */}
            <Box sx={{ marginTop: "20px" }}>
              <Typography variant="h5">Description</Typography>
              <Typography variant="body1">
                {certificate.course?.description || "No description available"}
              </Typography>
            </Box>

            {/* Organization Section */}
            <Box sx={{ marginTop: "20px" }}>
              <Typography variant="h5">About Organization</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <Avatar
                  src={certificate.organization?.avatar}
                  sx={{ width: 40, height: 40 }}
                />
                <Box>
                  <Typography variant="body1">
                    {certificate.organization?.name || "Unknown Organization"}
                  </Typography>
                  <Typography variant="body1">
                    {certificate.organization?.email || "No email available"}
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
