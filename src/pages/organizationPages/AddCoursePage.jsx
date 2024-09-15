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
  Input,
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import CssBaseline from "@mui/material/CssBaseline";
import axios from "axios";
import { API_BASE_URL } from "../../utils/constants";
import { useRef } from "react";

function AddCoursePage() {
  const inputFileRef = useRef(null);
  const [course, setCourse] = useState({
    title: "",
    description: "",
    price: 0,
    image: null,
    organization: "66e01ef93edd019a7fccbe71",
    documents: [{ title: "", content: "" }],
    finalQuiz: {
      title: "",
      duration: 0,
      questions: [
        {
          questionText: "",
          options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
          correctAnswer: "",
        },
      ],
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCourse({
        ...course,
        image: file, // Store the file object directly
      });
    }
  };

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

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...course.finalQuiz.questions];
    newQuestions[questionIndex].options[optionIndex].text = value;
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
          {
            questionText: "",
            options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
            correctAnswer: "",
          },
        ],
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a FormData object to include all the fields
      const formData = new FormData();
      formData.append("title", course.title);
      formData.append("description", course.description);
      formData.append("price", course.price);
      formData.append("organization", course.organization);

      // Append the image file to the FormData
      if (course.image) {
        formData.append("image", course.image);
      }

      // Append the documents and final quiz details (convert objects to JSON strings)
      formData.append("documents", JSON.stringify(course.documents));
      formData.append("finalQuiz", JSON.stringify(course.finalQuiz));

      // Send the form data using axios
      const response = await axios.post(`${API_BASE_URL}/course/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        console.log("Course submitted:", response.data);

        // Clear the form
        setCourse({
          title: "",
          description: "",
          price: 0,
          image: null,
          organization: "66e01ef93edd019a7fccbe71",
          documents: [{ title: "", content: "" }],
          finalQuiz: {
            title: "",
            duration: 0,
            questions: [
              {
                questionText: "",
                options: [
                  { text: "" },
                  { text: "" },
                  { text: "" },
                  { text: "" },
                ],
                correctAnswer: "",
              },
            ],
          },
        });

        // Clear the file input
        if (inputFileRef.current) {
          inputFileRef.current.value = null;
        }

        alert("Course submitted for admin review!");
      }
    } catch (error) {
      console.error("Failed to submit course:", error);
      alert("Failed to submit course. Please try again.");
    }
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
          {/* <TextField
            label="Image URL"
            fullWidth
            name="image"
            value={course.image}
            onChange={handleInputChange}
            sx={{ marginBottom: 3 }}
          /> */}
          <Input
            type="file"
            onChange={handleImageChange}
            ref={inputFileRef}
            sx={{ marginBottom: 2 }}
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
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(index, optIndex, e.target.value)
                  }
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
            Submit Course
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default AddCoursePage;
