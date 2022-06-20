import React from "react";
import { Route, Routes } from "react-router";

import NotFoundPage from "./404";

const Dashboard = () => {

    return (
        <>
            <Routes>
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </>
    );
};

export default Dashboard;
