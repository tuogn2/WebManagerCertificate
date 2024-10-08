// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux"; // Import Provider
import { PersistGate } from 'redux-persist/integration/react';


import Routes from "./routes/Routes";
import store, { persistor } from "./store/store";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";



function App() {
  return (
    <ThemeProvider theme={theme}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </PersistGate>
    </Provider>
    </ThemeProvider>
  );
}

export default App;
