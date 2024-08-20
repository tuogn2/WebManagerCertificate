// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux"; // Import Provider
import { PersistGate } from 'redux-persist/integration/react';


import Routes from "./routes/Routes";
import store, { persistor } from "./store/store";




function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
