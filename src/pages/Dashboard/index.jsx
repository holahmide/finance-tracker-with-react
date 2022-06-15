import React, { useState, useEffect } from "react";
import SideBar from "../../components/SideBar";
import NavBar from "../../components/NavBar";
import { FaHamburger } from "react-icons/fa";
import { Route, Routes, useLocation } from "react-router";
import DashboardIndex from "./dashboard";
import Spendings from "./Spendings";
import Lents from "./Lents";
import Borroweds from "./Borroweds";
import Limit from "./Limit";
import Profile from "./Profile";

const Dashboard = () => {
    const location = useLocation();
    const [sideBar, setSideBar] = useState(false);

    useEffect(() => {
        setSideBar(() => false)
    }, [location]);

    const toggleSideBar = () => {
        setSideBar((oldValue) => !oldValue);
    };

    return (
        <>
            <div className="flex flex-nowrap w-full">
                <SideBar sideBar={sideBar} />
                <div className="w-full md:ml-[300px] m-0">
                    <NavBar />
                    <div className="p-6 mt-11">
                        <Routes>
                            <Route path="/" exact element={<DashboardIndex />} />
                            <Route path="/spendings" exact element={<Spendings />} />
                            <Route path="/lents" exact element={<Lents />} />
                            <Route path="/borroweds" exact element={<Borroweds />} />
                            <Route path="/limit" exact element={<Limit />} />
                            <Route path="/profile" exact element={<Profile />} />
                        </Routes>
                    </div>
                </div>
            </div>
            <div
                onClick={() => toggleSideBar()}
                className={`${sideBar ? "text-main border-main border-2" : ""
                    } z-40 md:hidden fixed bottom-0 right-0 m-3 p-3 dark:bg-dark bg-gray-300 rounded-full cursor-pointer shadow-lg text-gray-500 dark:text-gray-400  hover:text-main hover:border-main hover:border-2 transition-all`}
            >
                <FaHamburger className="text-xl cursor-pointer" />
            </div>
        </>
    );
};

export default Dashboard;
