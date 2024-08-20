// src/pages/Home.jsx
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { purple } from "@mui/material/colors";
import Header from "../components/Header";

const settings = [
  "My Documents",
  "Give Access",
  "Free Access",
  "Change Institute",
];

const Home = () => {
  const user = useSelector((state) => state.auth.user); // Lấy người dùng từ Redux store
  const navigate = useNavigate(); // Hook để điều hướng

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Điều hướng đến trang đăng nhập nếu người dùng không tồn tại
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Hoặc hiển thị một loader nếu muốn
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>
      <main>
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
                  <Avatar src={user.avt} />
                  <Typography variant="subtitle1">{user.name}</Typography>
                  <Typography variant="subtitle2">{user.email}</Typography>
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
      </main>
    </>
  );
};

export default Home;
