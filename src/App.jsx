// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux"; // Import Provider
import Routes from "./routes/Routes";
import store from "./store/store";


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
