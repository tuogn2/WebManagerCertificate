import React from "react";
import {
  Modal,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Button,
} from "@mui/material";

function CourseDetailsModal({ modalOpen, handleCloseModal, selectedCourse }) {
  return (
    <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      aria-labelledby="course-details-modal"
      aria-describedby="course-details-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          p: 4,
          width: "80vw", // Set width to 80% of the viewport width
          maxWidth: "700px", // Max width of the modal
          maxHeight: "80vh", // Limit the height of the modal
          overflowY: "auto", // Enable scrolling if content overflows
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {selectedCourse && (
          <>
            <Typography variant="h6" gutterBottom>
              Course Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="h6">
              Title: {selectedCourse.title}
            </Typography>
            <Typography variant="body1">
              Description: {selectedCourse.description}
            </Typography>
            <Typography variant="body1">
              Price: ${selectedCourse.price}
            </Typography>
            <Typography variant="body1">
              Organization: {selectedCourse.organization.name}
            </Typography>

            {/* Documents section */}
            <Typography variant="h6" sx={{ mt: 3 }}>
              Documents
            </Typography>
            <List>
              {selectedCourse.documents.map((doc) => (
                <ListItem key={doc._id}>
                  <ListItemText primary={doc.title} secondary={doc.content} />
                </ListItem>
              ))}
            </List>

            {/* Final Quiz section */}
            <Typography variant="h6" sx={{ mt: 3 }}>
              Final Quiz
            </Typography>
            {selectedCourse.finalQuiz && (
              <Stack spacing={2}>
                <Typography variant="body1">
                  Title: {selectedCourse.finalQuiz.title}
                </Typography>
                {selectedCourse.finalQuiz.questions.map((question) => (
                  <Box
                    key={question._id}
                    sx={{ border: "1px solid", borderRadius: 1, p: 2, mb: 2 }}
                  >
                    <Typography variant="body1">
                      {question.questionText}
                    </Typography>
                    {question.options.map((option) => (
                      <Typography
                        key={option._id}
                        variant="body2"
                        sx={{ ml: 2 }}
                      >
                        - {option.text}
                      </Typography>
                    ))}
                    <Typography variant="body2" sx={{ mt: 1,color:'red' }}>
                      Correct Answer: {question.correctAnswer}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}

            {/* Close button */}
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleCloseModal}
            >
              Close
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default CourseDetailsModal;
