import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import {
  People,
  School,
  BarChart,
  Verified,
  MonetizationOn,
} from "@mui/icons-material";

const DashboardPage = () => {
  // Dummy data
  const stats = {
    totalCourses: 150,
    totalStudents: 5000,
    activeUsers: 1200,
    certificatesIssued: 3000,
    totalRevenue: "$50,000",
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Grid item xs={12} sm={6} md={4}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: "16px",
          background: `linear-gradient(135deg, ${color[0]}, ${color[1]})`,
          color: "#fff",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)",
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={2}
          sx={{ fontSize: "3rem" }}
        >
          {icon}
        </Box>
        <Typography variant="h6" fontWeight="600">
          {title}
        </Typography>
        <Typography variant="h3" fontWeight="bold">
          {value}
        </Typography>
      </Paper>
    </Grid>
  );

  return (
    <Box p={4} sx={{ backgroundColor: "#f5f6fa", minHeight: "100vh" }}>
      <Typography
        variant="h3"
        fontWeight="700"
        mb={4}
        textAlign="center"
        color="primary"
      >
        Dashboard Overview
      </Typography>
      <Grid container spacing={4}>
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={<School fontSize="large" />}
          color={["#6a11cb", "#2575fc"]} // Gradient colors
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={<People fontSize="large" />}
          color={["#ff7e5f", "#feb47b"]}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={<BarChart fontSize="large" />}
          color={["#43cea2", "#185a9d"]}
        />
        <StatCard
          title="Certificates Issued"
          value={stats.certificatesIssued}
          icon={<Verified fontSize="large" />}
          color={["#F7971E", "#FFD200"]}
        />
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          icon={<MonetizationOn fontSize="large" />}
          color={["#e1eec3", "#f05053"]}
        />
      </Grid>
    </Box>
  );
};

export default DashboardPage;
