import {
  AppBar,
  Box,
  Button,
  Container,
  createTheme,
  CssBaseline,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Route, Routes, useNavigate, useRoutes } from "react-router-dom";
import Header from "../components/Header";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";

const sections = [
  { name: "Account", path: "/account" },
  { name: "Communication Preferences", path: "/communication-preferences" },
];

const Account = () => (
  <Box>
    <Typography variant="h5">Account Settings</Typography>
    <Typography>Manage your account details here.</Typography>
  </Box>
);

const CommunicationPreferences = () => (
  <Box>
    <Typography variant="h5">Communication Preferences</Typography>
    <Typography>Set your communication preferences here.</Typography>
  </Box>
);

const AccountSettings = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState("/account");

  const handleListItemClick = (path) => {
    setSelectedSection(path);
    navigate(path);
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl">
        <Grid container spacing={2} p={10}>
          <Grid item xs={3}>
            <Paper variant="outlined">
              <List>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemButton>Account</ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemButton>Communication</ListItemButton>
                </ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <Paper style={{}}>
              <Typography variant="h4">Password</Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Current password
                    </Typography>
                    <TextField type="password"></TextField>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      New password
                    </Typography>
                    <TextField type="password"></TextField>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      Retype password
                    </Typography>
                    <TextField type="password"></TextField>
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  sx={{ alignSelf: "center", mt: 5, mb: 5 }}
                >
                  Change password
                </Button>
              </Box>
              {/* <Routes>
                <Route path="/account" element={<Account />} />
                <Route
                  path="/communication-preferences"
                  element={<CommunicationPreferences />}
                />
              </Routes> */}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AccountSettings;
