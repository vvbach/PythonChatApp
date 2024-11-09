import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import User from "../User/User";

const Users = () => {
    const users = useLoaderData();
    return (
        <div className="flex flex-row h-screen">
            <div className="flex flex-col w-2/5 border">
                <div className="flex flex-col mx-3 mb-3 overflow-y-auto">
                    {users.map((user) => (
                        <User key={user.id} user={user} />
                    ))}
                </div>
            </div>
            <div className="w-full">
                <div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Users;
