import React, { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { chatIdLoader, newChatIdLoader } from "../../utilities/apiLoaders";

const MyProfile = () => {
    const profile = useLoaderData();
    // console.log(profile);
    const { first_name, last_name, email, username, phone, active, id } =
        profile;


    return (
        <div className="flex justify-center items-center h-screen">
            
                <ul>
                    <li>User Name: {username}</li>
                    <li>Email: {email}</li>
                </ul>
          
           
        </div>
    );
};

export default MyProfile;
