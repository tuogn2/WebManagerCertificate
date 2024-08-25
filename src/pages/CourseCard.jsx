import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  CardActionArea,
} from "@mui/material";

function CourseCard({ title, subtitle, imageUrl, provider }) {
  return (
    <Card
      sx={{ borderRadius: "20px", boxShadow: "5px 4px 10px rgba(0,0,0,0.1)" }}
    >
      <CardActionArea>
        <CardMedia component="img" height="140" image={imageUrl} alt={title} />
        <CardContent>
          <Typography variant="h5" color="textSecondary" component={"div"}>
            {provider}
          </Typography>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default CourseCard;
