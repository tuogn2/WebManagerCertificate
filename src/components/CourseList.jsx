import React, { memo, useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Pagination, // Import Pagination component từ MUI
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1); // Thêm state lưu trữ tổng số trang
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching courses for page", page);
    let isMounted = true; // Chỉ thực thi khi component còn mounted
    fetchCourses(page, isMounted);
    return () => {
      isMounted = false; // Cleanup khi component unmount
    };
  }, [page]);

  const fetchCourses = async (currentPage, isMounted) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/course/pagination?page=${currentPage}&limit=${limit}`
      );
      console.log("Fetched courses:", response.data.data);
      if (isMounted) {
        const fetchedCourses = response.data.data;
        setCourses(fetchedCourses);
        setTotalPages(response.data.meta.totalPages); // Lưu tổng số trang
        setHasMore(currentPage < response.data.meta.totalPages);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value); // Cập nhật trang khi người dùng chọn một trang mới
  };

  return (
    <div>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card
              sx={{
                position: "relative",
                boxShadow: 3,
                borderRadius: 2,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
              }}
            >
              <CardActionArea onClick={() => navigate(`/course/${course._id}`)}>
                <CardMedia
                  component="img"
                  height="200"
                  image={course.image}
                  alt={course.title}
                  sx={{
                    filter: "brightness(0.85)",
                    transition: "filter 0.3s",
                    "&:hover": {
                      filter: "brightness(1)",
                    },
                  }}
                />
                <CardContent
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                    color: "#fff",
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
                    {course.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {course.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination component */}
      <Pagination
        count={totalPages} // Số trang
        page={page} // Trang hiện tại
        onChange={handlePageChange} // Hàm xử lý khi chuyển trang
        color="primary"
        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
      />
    </div>
  );
};

export default memo(CourseList);
