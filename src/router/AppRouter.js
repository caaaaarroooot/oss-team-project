import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FormPage from "../pages/FormPage";
import ListPage from "../pages/ListPage";
import DetailPage from "../pages/DetailPage";
import Navbar from '../component/Navbar';

const AppRouter = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<ListPage />} />
                <Route path="/form" element={<FormPage />} />
                <Route path="/edit/:id" element={<DetailPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
