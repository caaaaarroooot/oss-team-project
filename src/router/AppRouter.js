import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormPage from "../pages/FormPage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
