import * as React from "react";
import { useState } from "react";
import { Box, TextField, Button, Typography, Grid, Paper } from "@mui/material";
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
    // Add logic to save the course data (API call, etc.)
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{ padding: 4, maxWidth: "800px", margin: "0 auto" }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography variant="h4" gutterBottom>
          Add New Course
        </Typography>

        {/* Course Information */}
        <TextField
          label="Title"
          fullWidth
          name="title"
          value={course.title}
          onChange={handleInputChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Description"
          fullWidth
          name="description"
          value={course.description}
          onChange={handleInputChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Organization"
          fullWidth
          name="organization"
          value={course.organization}
          onChange={handleInputChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Price"
          fullWidth
          name="price"
          type="number"
          value={course.price}
          onChange={handleInputChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Image URL"
          fullWidth
          name="image"
          value={course.image}
          onChange={handleInputChange}
          sx={{ marginBottom: 2 }}
        />

        {/* Documents */}
        <Typography variant="h5" sx={{ marginTop: 4 }}>
          Course Documents
        </Typography>

        {course.documents.map((doc, index) => (
          <Paper key={index} sx={{ padding: 2, marginBottom: 2 }}>
            <TextField
              label="Document Title"
              fullWidth
              value={doc.title}
              onChange={(e) =>
                handleDocumentChange(index, "title", e.target.value)
              }
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Document Content"
              fullWidth
              value={doc.content}
              onChange={(e) =>
                handleDocumentChange(index, "content", e.target.value)
              }
              sx={{ marginBottom: 2 }}
            />
          </Paper>
        ))}

        <Button variant="outlined" onClick={handleAddDocument}>
          Add Document
        </Button>

        {/* Final Quiz */}
        <Typography variant="h5" sx={{ marginTop: 4 }}>
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
          <Paper key={index} sx={{ padding: 2, marginBottom: 2 }}>
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

        <Button variant="outlined" onClick={handleAddQuizQuestion}>
          Add Question
        </Button>

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
