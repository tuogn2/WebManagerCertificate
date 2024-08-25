import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import { HEADER_COLOR } from "../styles/styles";

const Footer = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#5423b7",
      }}
    >
      <Box>
        <Typography variant="h6" gutterBottom color={"#fff"}>
          © {new Date().getFullYear()} M-Certificate Inc. All rights reserved.
        </Typography>
      </Box>
      <Box>
        <IconButton href="https://facebook.com">
          <Facebook sx={{ color: "#fff" }} />
        </IconButton>
        <IconButton href="https://twitter.com">
          <Twitter sx={{ color: "#fff" }} />
        </IconButton>
        <IconButton href="https://instagram.com">
          <Instagram sx={{ color: "#fff" }} />
        </IconButton>
        <IconButton href="https://linkedin.com">
          <LinkedIn sx={{ color: "#fff" }} />
        </IconButton>
      </Box>
    </Container>
  );
};

export default Footer;
