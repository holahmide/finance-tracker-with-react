import { useContext } from "react";
import { FaUserAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const SideBar = ({ sideBar }) => {
    const context = useContext(AuthContext);
    const { pathname } = useLocation();
    const activeLink = 'w-full p-2 bg-main text-white dark:bg-primary dark:hover:bg-primary hover:bg-main rounded-md mb-3 pl-6';
    const link = 'w-full p-2 dark:bg-black bg-tertiary-1 hover:bg-main dark:hover:bg-primary rounded-md mb-3 pl-6';

    const linkStyle = (path) => {
        if (!path) {
            // For dashbaord
            return !pathname.split("/")[2] ? activeLink : link;
        }
        return pathname.split("/")[2] === path ? activeLink : link;
    }

    return (
        <div
            className={`${sideBar ? "" : "hidden"
                } overflow-y-auto fixed md:relative md:block dark:bg-dark bg-gray-300 shadow-xl z-30 p-5 flex justify-center`}
            style={{
                height: "100vh",
                width: "100vw",
                maxWidth: "300px",
                minWidth: "300px",
                position: "fixed",
            }}
        >
            <div className="w-full">
                <div className="flex justify-center mt-5">
                    <div className="border-2 border-gray-500 dark:border-gray-200 p-5 rounded-full">
                        <FaUserAlt className="text-6xl cursor-pointer text-center dark:text-gray-200 text-gray-500" />
                    </div>
                </div>
                <div className="mt-4">{`${context.user.firstname} ${context.user.lastname}`}</div>
                <div className="mt-3 w-full text-left">
                    {/* <Link to="/dashboard">
                        <div className={linkStyle("")}>Dashboard</div>
                    </Link> */}

                    <Link to="/dashboard/spendings">
                        <div className={linkStyle("spendings")}>Spendings</div>
                    </Link>
                    <Link to="/dashboard/lents">
                        <div className={linkStyle("lents")}>Lents</div>
                    </Link>
                    <Link to="/dashboard/borroweds">
                        <div className={linkStyle("borroweds")}>Borroweds</div>
                    </Link>
                    <Link to="/dashboard/limit">
                        <div className={linkStyle("limit")}>Limit</div>
                    </Link>
                    <Link to="/dashboard/profile">
                        <div className={linkStyle("profile")}>Profile</div>
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default SideBar;
