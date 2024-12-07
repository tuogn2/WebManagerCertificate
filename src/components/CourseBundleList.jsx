import React, { memo, useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Pagination, // Thêm Pagination từ MUI
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const CourseBundleList = () => {
  const [courseBundles, setCourseBundles] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching course bundles for page", page);
    let isMounted = true; // Chỉ thực thi khi component còn mounted
    fetchCourseBundles(page, isMounted);
    return () => {
      isMounted = false; // Cleanup khi component unmount
    };
  }, [page]);

  const fetchCourseBundles = async (currentPage, isMounted) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/coursebundles/pagination?page=${currentPage}&limit=${limit}`
      );
      console.log("Fetched course bundles:", response.data.data);
      if (isMounted) {
        const fetchedBundles = response.data.data;
        setCourseBundles(fetchedBundles);
        setTotalPages(response.data.meta.totalPages); // Cập nhật tổng số trang
      }
    } catch (error) {
      console.error("Error fetching course bundles:", error);
    }
  };

  // Hàm xử lý khi người dùng chuyển trang
  const handlePageChange = (event, value) => {
    setPage(value); // Cập nhật trang hiện tại
  };

  return (
    <div>
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {courseBundles.map((bundle) => (
          <Grid item xs={12} sm={6} md={4} key={bundle._id}>
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
              <CardActionArea
                onClick={() => navigate(`/bundle/${bundle._id}`)}
                sx={{ position: "relative" }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={bundle.image} // Thêm ảnh cho bundle
                  alt={bundle.title}
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
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    {bundle.title}
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
                    {bundle.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination component */}
      <Pagination
        count={totalPages} // Tổng số trang
        page={page} // Trang hiện tại
        onChange={handlePageChange} // Hàm thay đổi trang
        color="primary"
        sx={{ mt: 3, display: "flex", justifyContent: "center" }} // Canh giữa nút phân trang
      />
    </div>
  );
};

export default memo(CourseBundleList);
