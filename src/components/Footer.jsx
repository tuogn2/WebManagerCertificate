import * as React from "react";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import { Box, Typography, Link, Grid, Container } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.primary.dark
            : theme.palette.primary.main,
        p: 6,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={20}>
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <Box>
              <Typography variant="h5" color="white" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2" color="white">
                12 Nguyen Van Bao, Go Vap district, Ho Chi Minh city
              </Typography>
              <Typography variant="body2" color="white">
                Email: info@example.com
              </Typography>
              <Typography variant="body2" color="white">
                Phone: +1 234 567 8901
              </Typography>
            </Box>
            <Box>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3918.8582378431365!2d106.6842705!3d10.8221589!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174deb3ef536f31%3A0x8b7bb8b7c956157b!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2hp4buHcCBUUC5IQ00!5e0!3m2!1svi!2s!4v1724731969715!5m2!1svi!2s"
                width="150"
                height="150"
                loading="lazy"
                style={{ border: 0 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h5"
              color="white"
              textAlign={"center"}
              gutterBottom
            >
              About Us
            </Typography>
            <Typography variant="body2" color="white" textAlign={"center"}>
              We are educational organization, dedicated to providing the best
              service to our customers.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h5" color="white" gutterBottom>
              Follow Us
            </Typography>
            <Link href="https://www.facebook.com/" sx={{ color: "white" }}>
              <Facebook />
            </Link>
            <Link
              href="https://www.instagram.com/"
              sx={{ pl: 1, pr: 1, color: "white" }}
            >
              <Instagram />
            </Link>
            <Link href="https://www.twitter.com/" sx={{ color: "white" }}>
              <Twitter />
            </Link>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="white" align="center">
            {"Copyright © "}
            <Link color="inherit" href="#">
              M-Certificate
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
