import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormPage from "../pages/FormPage";
import ListPage from "../pages/ListPage";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ListPage />} />
                <Route path="/form" element={<FormPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
