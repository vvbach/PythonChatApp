import React from "react";
import ActiveLink from "../ActiveLink/ActiveLink";

const User = ({ user }) => {
    // console.log(user);
    const { username, email, id } = user;
    return (
        <div className="flex flex-col justify-center my-1 h-20 w-full">
            <ActiveLink to={`/cp/users/profile/${id}`}>
                <div className="flex flex-row items-center h-[60px]">
                    <h4 className="text-2xl">{username}</h4>
                </div>
            </ActiveLink>
        </div>
    );
};

export default User;
