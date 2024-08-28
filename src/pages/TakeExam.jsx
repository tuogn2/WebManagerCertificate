import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector từ react-redux
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  CssBaseline,
  AppBar,
  Container,
} from "@mui/material";
import Header from "../components/Header";
import { API_BASE_URL } from "../utils/constants";
import Footer from "../components/Footer";

const TakeExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Lấy thông tin người dùng từ Redux
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({}); // Lưu trữ câu trả lời của người dùng
  console.log(exam);
  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/test/${id}`);
        setExam(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch exam details.");
        setLoading(false);
      }
    };
    fetchExamDetails();
  }, [id]);

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!user || !user.id) {
        throw new Error("User information is missing.");
      }

      // Gửi yêu cầu nộp bài kiểm tra
      const response = await axios.post(`${API_BASE_URL}/testAttempt`, {
        user: user.id, // Đảm bảo rằng user.id được gửi đúng cách
        test: id,
        answers,
      });

      // Kiểm tra xem bài kiểm tra có pass hay không
      const { score, passed } = response.data;

      if (passed) {
        // Nếu vượt qua bài kiểm tra, tạo chứng chỉ
        const certificateResponse = await axios.post(
          `${API_BASE_URL}/certificates`,
          {
            user: user.id,
            organization: exam.organization._id,
            test: id,
            score: score, // Sử dụng điểm số từ phản hồi bài kiểm tra
          }
        );

        if (certificateResponse.data.imageUrl) {
          window.location.href = certificateResponse.data.imageUrl;
        }
      }

      // Điều hướng đến trang kết quả sau khi xử lý xong
      navigate("/results");
    } catch (error) {
      console.error("Error submitting test attempt:", error);
      setError("Failed to submit answers.");
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!exam) {
    return <Typography>No exam found.</Typography>;
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Header />
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 20, mb: 20 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(-1)} // Quay lại trang trước
          sx={{ mb: 3 }}
        >
          Back
        </Button>

        <Typography variant="h4" gutterBottom>
          {exam.title}
        </Typography>

        {exam.questions.map((question, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Typography variant="h6">{question.questionText}</Typography>
            <FormControl component="fieldset">
              <RadioGroup
                value={answers[question._id] || ""}
                onChange={(e) =>
                  handleAnswerChange(question._id, e.target.value)
                }
              >
                {question.options.map((option, idx) => (
                  <FormControlLabel
                    key={idx}
                    value={option._id}
                    control={<Radio />}
                    label={option.text}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        ))}

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Container>
      <Footer />
    </>
  );
};

export default TakeExam;
