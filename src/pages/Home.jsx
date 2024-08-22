import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button, // Import Button từ MUI
  Container,
  CssBaseline,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import Header from "../components/Header";
import { getAllTests } from "../store/slices/testSlice"; // Import hành động getAllTests

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tests, loading, error } = useSelector((state) => state.tests); // Lấy dữ liệu từ store
  const user = useSelector((state) => state.auth.user); // Lấy người dùng từ Redux store

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Điều hướng đến trang đăng nhập nếu người dùng không tồn tại
    } else {
      dispatch(getAllTests()); // Gọi hành động getAllTests để lấy dữ liệu
    }
  }, [user, navigate, dispatch]);

  if (!user) {
    return null; // Hoặc hiển thị một loader nếu muốn
  }

  const handleTakeTest = (testId) => {
    navigate(`/tests/${testId}`); // Điều hướng đến trang chi tiết test
  };

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
            <Grid item xs={12}>
              <Typography variant="h4" component="h1" gutterBottom>
                Available Tests
              </Typography>
              {loading && <Typography>Loading...</Typography>}
              {error && <Typography color="error">{error}</Typography>}
              <Grid container spacing={2}>
              {tests.map((test) => (
                  <Grid item xs={12} sm={6} md={4} key={test._id}>
                    <Box
                      bgcolor="white"
                      p={2}
                      borderRadius="8px"
                      boxShadow={3}
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                    >
                      {test.image && (
                        <img
                          src={test.image}
                          alt={test.title}
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "8px",
                          }}
                        />
                      )}
                      <Box sx={{ mt: 2, width: "100%" }}>
                        <Typography variant="h6" component="h2">
                          {test.title}
                        </Typography>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mt={1}
                        >
                          <Typography variant="body1" color="textSecondary">
                            {test.price === 0 ? "Free" : `$${test.price}`}
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleTakeTest(test._id)}
                          >
                            Take Test
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </main>
    </>
  );
};

export default Home;
