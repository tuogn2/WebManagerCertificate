import * as React from "react";
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import CssBaseline from "@mui/material/CssBaseline";

function AddCoursePage() {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    organization: "",
    price: 0,
    image: "",
    documents: [{ title: "", content: "" }],
    finalQuiz: {
      title: "",
      duration: 0,
      questions: [
        {
          questionText: "",
          options: ["", "", "", ""],
          correctAnswer: "",
        },
      ],
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleDocumentChange = (index, field, value) => {
    const newDocuments = [...course.documents];
    newDocuments[index][field] = value;
    setCourse({ ...course, documents: newDocuments });
  };

  const handleQuizChange = (index, field, value) => {
    const newQuestions = [...course.finalQuiz.questions];
    newQuestions[index][field] = value;
    setCourse({
      ...course,
      finalQuiz: { ...course.finalQuiz, questions: newQuestions },
    });
  };

  const handleAddDocument = () => {
    setCourse({
      ...course,
      documents: [...course.documents, { title: "", content: "" }],
    });
  };

  const handleAddQuizQuestion = () => {
    setCourse({
      ...course,
      finalQuiz: {
        ...course.finalQuiz,
        questions: [
          ...course.finalQuiz.questions,
          { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
        ],
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(course);
    // Add logic to save the course data
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          padding: 4,
          maxWidth: "900px",
          margin: "0 auto",
          backgroundColor: "#f5f5f5",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Add New Course
        </Typography>

        {/* Course Information */}
        <Paper sx={{ padding: 3, marginBottom: 4 }} elevation={3}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Course Information
          </Typography>

          <TextField
            label="Title"
            fullWidth
            name="title"
            value={course.title}
            onChange={handleInputChange}
            sx={{ marginBottom: 3 }}
          />
          <TextField
            label="Description"
            fullWidth
            name="description"
            multiline
            rows={3}
            value={course.description}
            onChange={handleInputChange}
            sx={{ marginBottom: 3 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Organization"
                fullWidth
                name="organization"
                value={course.organization}
                onChange={handleInputChange}
                sx={{ marginBottom: 3 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Price"
                fullWidth
                name="price"
                type="number"
                value={course.price}
                onChange={handleInputChange}
                sx={{ marginBottom: 3 }}
              />
            </Grid>
          </Grid>
          <TextField
            label="Image URL"
            fullWidth
            name="image"
            value={course.image}
            onChange={handleInputChange}
            sx={{ marginBottom: 3 }}
          />
        </Paper>

        {/* Documents */}
        <Paper sx={{ padding: 3, marginBottom: 4 }} elevation={3}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Course Documents
          </Typography>

          {course.documents.map((doc, index) => (
            <Paper
              key={index}
              sx={{ padding: 2, marginBottom: 2 }}
              elevation={1}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    label="Document Title"
                    fullWidth
                    value={doc.title}
                    onChange={(e) =>
                      handleDocumentChange(index, "title", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    label="Document Content"
                    fullWidth
                    value={doc.content}
                    onChange={(e) =>
                      handleDocumentChange(index, "content", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton color="error">
                    <RemoveCircle />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Button
            variant="outlined"
            startIcon={<AddCircle />}
            onClick={handleAddDocument}
          >
            Add Document
          </Button>
        </Paper>

        {/* Final Quiz */}
        <Paper sx={{ padding: 3, marginBottom: 4 }} elevation={3}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Final Quiz
          </Typography>
          <TextField
            label="Quiz Title"
            fullWidth
            value={course.finalQuiz.title}
            onChange={(e) =>
              setCourse({
                ...course,
                finalQuiz: { ...course.finalQuiz, title: e.target.value },
              })
            }
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Quiz Duration (minutes)"
            fullWidth
            value={course.finalQuiz.duration}
            onChange={(e) =>
              setCourse({
                ...course,
                finalQuiz: { ...course.finalQuiz, duration: e.target.value },
              })
            }
            sx={{ marginBottom: 2 }}
          />

          {course.finalQuiz.questions.map((question, index) => (
            <Paper
              key={index}
              sx={{ padding: 2, marginBottom: 2 }}
              elevation={1}
            >
              <TextField
                label={`Question ${index + 1}`}
                fullWidth
                value={question.questionText}
                onChange={(e) =>
                  handleQuizChange(index, "questionText", e.target.value)
                }
                sx={{ marginBottom: 2 }}
              />
              {question.options.map((option, optIndex) => (
                <TextField
                  key={optIndex}
                  label={`Option ${optIndex + 1}`}
                  fullWidth
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...question.options];
                    newOptions[optIndex] = e.target.value;
                    handleQuizChange(index, "options", newOptions);
                  }}
                  sx={{ marginBottom: 2 }}
                />
              ))}
              <TextField
                label="Correct Answer"
                fullWidth
                value={question.correctAnswer}
                onChange={(e) =>
                  handleQuizChange(index, "correctAnswer", e.target.value)
                }
                sx={{ marginBottom: 2 }}
              />
            </Paper>
          ))}

          <Button
            variant="outlined"
            startIcon={<AddCircle />}
            onClick={handleAddQuizQuestion}
          >
            Add Question
          </Button>
        </Paper>

        <Box sx={{ marginTop: 4 }}>
          <Button variant="contained" color="primary" type="submit">
            Save Course
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default AddCoursePage;
