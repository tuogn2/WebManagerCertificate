import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  CssBaseline,
  AppBar,
  Toolbar,
  Container,
  Divider,
  LinearProgress,
  Tooltip,
  ButtonBase,
  Button,
} from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import axios, { all } from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { useNavigate } from "react-router-dom";

const Accomplishments = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // get all certificates
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/certificates/student/${user._id || user.id}`)
      .then((response) => {
        let allCertificates = response.data;
        console.log(allCertificates);
        setCertificates(allCertificates);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  // Handle coppy link
  const handleCopyLink = (certificateLink) => {
    navigator.clipboard
      .writeText(certificateLink)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // Function to handle certificate download
  const handleDownloadCertificate = (certificateUrl, certificateTitle) => {
    // Create an anchor element
    const link = document.createElement("a");
    link.href = certificateUrl;
    link.download = `${certificateTitle}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return <Typography variant="h6">Error: {error.message}</Typography>;
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
        <Box mt={3}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "Highlight",
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
            Accomplishments
          </Typography>
          <Divider variant="middle" />
        </Box>
        <Container maxWidth={"lg"} sx={{ mt: 5, mb: 20 }}>
          <Grid container spacing={4}>
            {certificates.map((certificate) => (
              <Grid item xs={12} sm={6} md={4} key={certificate._id}>
                <Button
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 6,
                    },
                  }}
                  onClick={() =>
                    navigate("/show-certificate", { state: certificate })
                  }
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={certificate.imageUrl || "placeholder-image-url"} // Placeholder if no image
                    alt="Certificate"
                    sx={{ borderRadius: "4px 4px 0 0", resize: "both" }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {certificate?.course
                        ? certificate.course.title
                        : certificate.bundle.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Issued on:{" "}
                      {new Date(certificate.issueDate).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ mt: 2, textAlign: "right" }}>
                      <Tooltip title="Download Certificate">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            handleDownloadCertificate(
                              certificate.imageUrl,
                              certificate.course.title
                            )
                          }
                        >
                          <CloudDownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Copy link">
                        <IconButton
                          color="primary"
                          onClick={() => handleCopyLink(certificate.imageUrl)}
                        >
                          <AddLinkIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Button>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Container>

      <Footer />
    </>
  );
};

export default Accomplishments;
