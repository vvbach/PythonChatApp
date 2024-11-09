import React from "react";
import { Link } from "react-router-dom";
import Logout from "../Logout/Logout";

const Sidebar = ({ username }) => {
    return (
       
        <div className="flex flex-row lg:flex-col text-white justify-between  bg-teal-900 lg:overflow-y-auto lg:h-screen lg:top-0 lg:left-0 p-2">
            <div className="p-4 items-center">
                <h1 className="text-3xl font-bold">Chopper</h1>
            </div>
            <div className="lg:ml-4 flex items-center lg:items-start ">
                <ul className="flex lg:flex-col lg:items-start ">
                    <li className="mr-2 lg:my-2">
                        <Link to="/cp/chat" className="hover:text-amber-400">
                            Chats
                        </Link>
                    </li>
                    <li className="mr-2 lg:my-2">
                        <Link to="/cp/me" className="hover:text-amber-400">
                            Profile
                        </Link>
                    </li>
                    <li className="mr-2 lg:my-2">
                        <Link to="/cp/users" className="hover:text-amber-400">
                            User
                        </Link>
                    </li>
                </ul>
            </div>

            <div>
                <div className="px-4">
                    <h1 className="text-xl font-bold">{username}</h1>
                </div>
                <Logout />
            </div>
        </div>
    );
};

export default Sidebar;
