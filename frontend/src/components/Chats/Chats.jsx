import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import Chat from "../Chat/Chat";

const Chats = () => {
    const chats = useLoaderData();
    return (
        <div className="flex flex-row h-screen">
            <div className="flex flex-col w-2/5 mx-2 border border-r-slate-300 border-l-slate-300">

                <div className="flex flex-col mb-3 overflow-y-auto">
                {/* <div className="flex flex-col mx-3 mb-3 overflow-y-auto"> */}
                    {
                        chats.map(chat => <Chat 
                            key={chat.chat_id}
                            chat={chat}
                        />)
                    }
                </div>
                {/* <div className="flex flex-col overflow-y-auto">
                    <Users key={1} users={users} />
                </div> */}
            </div>
            <div className="w-full">
                <div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Chats;
