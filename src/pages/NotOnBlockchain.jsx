import React from 'react';
import { Container, Typography, Button, Box, AppBar, Toolbar, CssBaseline } from '@mui/material';
import { Link } from 'react-router-dom';

const NotOnBlockchain = () => {
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blockchain Explorer
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
        </Toolbar>
      </AppBar>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" color="warning.main" gutterBottom>
          Not Found on Blockchain
        </Typography>
        <Typography variant="h5" gutterBottom>
          The item you are searching for does not exist on the blockchain.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Ensure the transaction ID, address, or item is correct, or try again later.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          sx={{ mt: 3 }}
        >
          Back to Home
        </Button>
      </Container>
    </>
  );
};

export default NotOnBlockchain;
    