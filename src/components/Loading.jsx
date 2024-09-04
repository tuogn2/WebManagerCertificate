import React from 'react';
import { RingLoader } from 'react-spinners';
import { Box, Typography, Container } from '@mui/material';

const Loading = () => {
  return (
    <Container 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        <RingLoader color="#36d7b7" size={60} />
        <Typography variant="h6" mt={2}>
          Loading, please wait...
        </Typography>
      </Box>
    </Container>
  );
};

export default Loading;
