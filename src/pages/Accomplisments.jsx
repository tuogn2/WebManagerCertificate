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
} from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import AddLinkIcon from "@mui/icons-material/AddLink";

const Accomplishments = () => {
  const user = useSelector((state) => state.auth.user);

  // get all certificates
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/certificates`)
      .then((response) => {
        let allCertificates = response.data;
        setCertificates(
          allCertificates.filter(
            (certificate) => certificate.user._id === user._id
          )
        );
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
        <Container maxWidth={"lg"} sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {certificates.map((certificate) => (
              <Grid item xs={12} sm={6} md={4} key={certificate._id}>
                <Card
                  sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={certificate.imageUrl || "placeholder-image-url"} // Placeholder if no image
                    alt="Certificate"
                    sx={{ borderRadius: "4px 4px 0 0" }}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {certificate.course.title}
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
                </Card>
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
