// src/pages/Home.jsx
import * as React from "react";
import Header from "./Header";
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
      <main>
        <div>
          <Container maxWidth="xl" sx={{ display: "flex" }}>
            <Grid container spacing={1}>
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
            </Grid>
          </Container>
        </div>
      </main>
    </>
  );
};

export default Home;
