// src/pages/Home.jsx
import * as React from "react";
import Header from "../components/Header";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  ListItemButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import { purple } from "@mui/material/colors";
import CourseCard from "./CourseCard";
import Footer from "../components/Footer";

const settings = [
  "My Documents",
  "Give Access",
  "Free Access",
  "Change Institute",
];

const Home = () => {
  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom mt={10}>
          Most Popular Certificates
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <CourseCard
              title="Google Data Analytics"
              subtitle="Professional Certificate"
              imageUrl="src\assets\iStock-1169539468.png"
              provider="Google"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CourseCard
              title="Google Project Management"
              subtitle="Professional Certificate"
              imageUrl="src\assets\iStock-1169539468.png"
              provider="Google"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CourseCard
              title="Google Project Management"
              subtitle="Professional Certificate"
              imageUrl="src\assets\iStock-1169539468.png"
              provider="Google"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CourseCard
              title="Google Project Management"
              subtitle="Professional Certificate"
              imageUrl="src\assets\iStock-1169539468.png"
              provider="Google"
            />
          </Grid>
          {/* Add more cards as needed */}
        </Grid>

        {/* <Grid container spacing={1}>
              <Grid item xs={2}>
                <Box bgcolor="white" display={"flex"} flexDirection={"column"}>
                  <Typography variant="h5" mt={4} color="purple">
                    My Profile
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <Avatar />
                    <Typography variant="subtitle1">Name</Typography>
                    <Typography variant="subtitle2">Email</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      color="secondary"
                      sx={{ mt: 2 }}
                    >
                      View Profile
                    </Button>
                  </Box>
                  <List>
                    {settings.map((text) => (
                      <ListItemButton key={text}>
                        <ListItemIcon>
                          <FolderIcon style={{ color: purple[400] }} />
                        </ListItemIcon>
                        <ListItemText primary={text} />
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
              </Grid>
              <Grid item xs={7}>
                <Box bgcolor="lightgreen" p={2} height="100vh">
                  Part 2
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box bgcolor="lightcoral" p={2} height="100vh">
                  Part 3
                </Box>
              </Grid>
            </Grid> */}
      </Container>
    </>
  );
};

export default Home;
