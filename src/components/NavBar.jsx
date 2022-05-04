import { useContext } from "react";
import Toggle from "./UI/ThemeToggle";
import { FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
    const {logoutUser} = useContext(AuthContext);
    return (
        <div
            className="bg-gray-200 dark:bg-dark shadow-lg w-full"
            style={{ width: "100%" }}
        >
            <div className="flex justify-between w-full px-6 py-4">
                <div className="flex">
                    <div>

                    </div>
                    <div className="text-main font-bold dark:text-primary">BTrack</div>
                </div>
                <div>
                    <div className="flex gap-4">
                        <Toggle />
                        <FaSignOutAlt
                            onClick={() => logoutUser()}
                            className="text-gray-500 dark:text-gray-400 text-xl cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
