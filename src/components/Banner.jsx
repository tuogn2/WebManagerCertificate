import React from "react";
import { Carousel } from "antd";
import banner1 from "../assets/img1.jpg";
import banner2 from "../assets/img2.jpg";
import banner3 from "../assets/img3.jpg";
import "antd/dist/reset.css"; // Import Ant Design CSS

const banners = [banner1, banner2, banner3];

const contentStyle = {
  height: "450px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
  position: "relative",
  overflow: "hidden", // Make sure nothing overflows
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)", // Subtle shadow for the banner
  borderRadius: "10px", // Add rounded corners
  margin: "0 auto", // Center carousel if necessary
  maxWidth: "1200px", // Optional: Limit the max width of the carousel
};

function Banner() {
  return (
    <>
      <Carousel
        dotPosition="bottom"
        draggable
        arrows
        autoplay
        autoplaySpeed={1500}
      >
        {banners.map((banner, index) => (
          <div key={index}>
            <div style={contentStyle}>
              <img
                src={banner}
                alt={`Banner ${index + 1}`}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "10px", // Match the border radius
                }}
              />
            </div>
          </div>
        ))}
      </Carousel>
    </>
  );
}

export default Banner;
