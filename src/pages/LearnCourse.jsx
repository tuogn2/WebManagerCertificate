import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  AppBar,
  Toolbar,
  CssBaseline,
  Tabs,
  Tab,
  Paper,
  List,
  Radio,
  RadioGroup,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import Loading from "../components/Loading";
import NotFound from "./NotFound";
import Header from "../components/Header";
import { API_BASE_URL } from "../utils/constants.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  updateEnrollment,
  completeEnrollment,
} from "../store/slices/authSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Import the back icon

const LearnCourse = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isTakingQuiz, setIsTakingQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState([]); // To store quiz results
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/course/${id}`);
        setCourseData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchQuizResults = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/quiz/result/user/${user._id || user.id}/course/${id}`
        );
        // Assuming response.data is an array of results
        const sortedResults = response.data.sort((a, b) => b.score - a.score); // Sort results by score in descending order
        const topThreeResults = sortedResults.slice(0, 3); // Get the top 3 results

        setQuizResults(topThreeResults);
      } catch (error) {
        console.error("Error fetching quiz results:", error);
      }
    };

    fetchCourseData();
    fetchQuizResults();
  }, [id, user._id]);

  const hasEnrolled = user.enrollments.find(
    (enrollment) => enrollment.course.toString() === id
  );

  useEffect(() => {
    if (hasEnrolled) {
      setCompletedLessons(hasEnrolled.idOfItems || []);
    }
  }, [hasEnrolled]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleComplete = async (lessonId) => {
    if (!hasEnrolled) {
      setSnackbarMessage("You are not enrolled in this course.");
      setOpenSnackbar(true);
      return;
    }
    try {
      const updatedCompletedLessons = [...completedLessons, lessonId];
      setCompletedLessons(updatedCompletedLessons);
      const response = await axios.put(
        `${API_BASE_URL}/enrollment/${hasEnrolled._id}`,
        {
          idOfItems: updatedCompletedLessons,
          progress:
            (updatedCompletedLessons.length / courseData.documents.length) *
            100,
        }
      );
      dispatch(updateEnrollment(response.data));
      setSnackbarMessage("Lesson marked as completed");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error marking lesson as completed:", error);
      setSnackbarMessage("Error marking lesson as completed");
      setOpenSnackbar(true);
    }
  };

  const handleStartQuiz = () => {
    setIsTakingQuiz(true); // Start the quiz
  };

  const handleBackToQuizInfo = () => {
    setIsTakingQuiz(false); // Go back to quiz information
  };

  const handleAnswerChange = (questionId, answerId) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionId]: answerId,
    });
  };

  const handleSubmitQuiz = async () => {
    if (!hasEnrolled) {
      setSnackbarMessage("You are not enrolled in this course.");
      setOpenSnackbar(true);
      return;
    }
    const submissionData = {
      userId: user._id,
      courseId: id,
      answers: Object.keys(quizAnswers).map((questionId) => {
        const question = courseData.finalQuiz.questions.find(
          (q) => q._id === questionId
        );
        const selectedAnswer = question.options.find(
          (option) => option._id === quizAnswers[questionId]
        );
        return {
          questionId,
          answerText: selectedAnswer.text,
        };
      }),
    };

    try {
      // Submit the quiz
      const response = await axios.post(
        `${API_BASE_URL}/quiz/submit`,
        submissionData
      );

      // Handle successful submission
      setSnackbarMessage("Quiz submitted successfully!");
      setOpenSnackbar(true);
      setIsTakingQuiz(false);

      // Get the new quiz result from the response
      const newQuizResult = response.data.quizResult;
      // Check if the score is greater than or equal to 70
      if (newQuizResult.score >= 70) {
        // Create a certificate
        try {
          const certificateData = {
            user: user._id || user.id, // Assuming user contains the userId
            organization: courseData.organization._id, // Assuming courseData contains the organizationId
            course: id,
            score: newQuizResult.score,
          };
          console.log(certificateData);
          const certificateResponse = await axios.post(
            `${API_BASE_URL}/certificates`,
            certificateData
          );
          dispatch(completeEnrollment(hasEnrolled._id));
          setSnackbarMessage("Congratulations! You've earned a certificate.");
          setOpenSnackbar(true);
        } catch (certificateError) {
          console.error("Error creating certificate:", certificateError);
          setSnackbarMessage(
            "Quiz passed, but failed to create certificate. Please contact support."
          );
          setOpenSnackbar(true);
        }
      }

      // Update local state with the new quiz result
      const updatedQuizResults = [...quizResults, newQuizResult];

      // Sort the results by score in descending order and take the top 3
      const topThreeResults = updatedQuizResults
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      // Update the state with the top 3 results
      setQuizResults(topThreeResults);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setSnackbarMessage("Error submitting quiz. Please try again.");
      setOpenSnackbar(true);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !courseData) {
    return <NotFound />;
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Header />
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          display: "flex",
          mt: 4,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <Paper
          sx={{
            width: 240,
            height: "calc(100vh - 64px)",
            position: "fixed",
            top: 64,
            left: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            borderRight: 1,
            borderColor: "divider",
            boxSizing: "border-box",
          }}
        >
          <Tabs
            orientation="vertical"
            value={selectedTab}
            onChange={handleTabChange}
            aria-label="Course tabs"
            sx={{
              borderRight: 1,
              borderColor: "divider",
              overflowY: "auto",
            }}
          >
            {courseData.documents.map((doc, index) => (
              <Tab
                key={index}
                label={doc.title}
                id={`tab-${index}`}
                aria-controls={`tabpanel-${index}`}
                sx={{
                  backgroundColor: completedLessons.includes(doc._id)
                    ? "rgba(0, 255, 0, 0.2)" // Green background for completed items
                    : "transparent",
                  "&:hover": {
                    backgroundColor: completedLessons.includes(doc._id)
                      ? "rgba(0, 255, 0, 0.2)"
                      : "rgba(0, 0, 0, 0.04)", // Slightly different color on hover
                  },
                }}
              />
            ))}

            <Tab
              key={courseData.documents.length}
              label={courseData.finalQuiz.title}
              id={`tab-${courseData.documents.length}`}
              aria-controls={`tabpanel-${courseData.documents.length}`}
              sx={{
                backgroundColor: hasEnrolled.completed
                  ? "rgba(0, 255, 0, 0.2)" // Green background if all lessons are completed
                  : "transparent",
                "&:hover": {
                  backgroundColor:
                    completedLessons.length === courseData.documents.length
                      ? "rgba(0, 255, 0, 0.2)"
                      : "rgba(0, 0, 0, 0.04)", // Slightly different color on hover
                },
              }}
            />
          </Tabs>
        </Paper>
        <Box
          sx={{
            flexGrow: 1,
            marginLeft: "260px",
            padding: 2,
            boxSizing: "border-box",
            overflowY: "auto",
          }}
        >
          {courseData.documents.map((item, index) => (
            <div
              role="tabpanel"
              id={`tabpanel-${index}`}
              aria-labelledby={`tab-${index}`}
              hidden={selectedTab !== index}
              key={index}
            >
              <Card
                sx={{
                  mb: 2,
                  overflow: "hidden",
                  width: "100%",
                  boxShadow: "none",
                  border: "none",
                }}
              >
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {item.content}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => handleComplete(item._id)}
                    disabled={completedLessons.includes(item._id)}
                  >
                    Mark as Completed
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}

          {selectedTab === courseData.documents.length && (
            <div
              role="tabpanel"
              id={`tabpanel-${courseData.documents.length}`}
              aria-labelledby={`tab-${courseData.documents.length}`}
            >
              {isTakingQuiz ? (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    sx={{ mb: 2 }}
                    onClick={handleBackToQuizInfo}
                  >
                    Back
                  </Button>
                  {courseData.finalQuiz.questions.map((question, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        {index + 1}. {question.questionText}
                      </Typography>
                      <RadioGroup
                        name={`question-${index}`}
                        value={quizAnswers[question._id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(question._id, e.target.value)
                        }
                      >
                        {question.options.map((option, optionIndex) => (
                          <FormControlLabel
                            key={optionIndex}
                            value={option._id}
                            control={<Radio />}
                            label={option.text}
                          />
                        ))}
                      </RadioGroup>
                    </Box>
                  ))}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitQuiz}
                  >
                    Submit Quiz
                  </Button>
                </>
              ) : (
                <Card
                  sx={{
                    mb: 2,
                    overflow: "hidden",
                    width: "100%",
                    boxShadow: "none",
                    border: "none",
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {courseData.finalQuiz.title}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {courseData.finalQuiz.description}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Previous Quiz Scores:
                    </Typography>
                    <List sx={{ mb: 2 }}>
                      {quizResults.length > 0 ? (
                        quizResults.map((result, index) => (
                          <Typography key={index} variant="body2">
                            Attempt {index + 1}: {result.score}%
                          </Typography>
                        ))
                      ) : (
                        <Typography variant="body2">
                          No quiz attempts yet.
                        </Typography>
                      )}
                    </List>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleStartQuiz}
                      disabled={
                        completedLessons.length !==
                          courseData.documents.length || hasEnrolled.completed
                      } // Disable button if all lessons are not completed or if hasEnrolled.completed is true
                    >
                      {hasEnrolled.completed ? "Quiz Completed" : "Start Quiz"}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </Box>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LearnCourse;
