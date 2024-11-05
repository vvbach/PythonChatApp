import React, { useEffect, useState, useRef } from "react";
import Message from "../Message/Message";
import { useLoaderData, useLocation } from "react-router-dom";
import NoMessage from "../NoMessage/NoMessage";
import SendMessage from "../SendMessage/SendMessage";
import { getToken } from "../../utilities/tokenService";
import MessageBoxTop from "../MessageBoxTop/MessageBoxTop";

const Messages = () => {
    // Load data from API
    const chat = useLoaderData();

    // console.log(chat);

    // Data destructuring
    const { chat_id, type, messages, user_id, recipient_profile } = chat;
    const token = getToken();

    // Reference for the chat container
    const messageContainerRef = useRef(null);

    // Previous messages from Api
    const [previousMessages, setPreviousMessages] = useState([]);
    useEffect(() => {
        setPreviousMessages(messages);
    }, [messages]);

    const [clickedOnRecipient, setClickedOnRecipient] = useState(false);
    const handleRecipientProfileClick = () => {
        setClickedOnRecipient(true);
    };

    //--------------------------------------start handle SOCKET--------------------------------------------------
    // State to store the WebSocket instance
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        // const url = `ws://127.0.0.1:8000/ws/chat/${chat_id}`;
        const url = `ws://127.0.0.1:9000/ws/chat/${type}/${chat_id}/token=${token}`;

        // https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
        // Create a WebSocket instance
        const newSocket = new WebSocket(url);

        newSocket.onopen = () => {
            console.log(`WebSocket connection established for ${chat_id}`);
        };

        newSocket.onmessage = (event) => {
            console.log(event);

            const parsedMessage = JSON.parse(event.data);
            console.log("Received Message:", parsedMessage);

            setPreviousMessages([...previousMessages, parsedMessage]);
        };

        newSocket.onclose = () => {
            console.log("WebSocket connection closed.");
        };

        setSocket(newSocket);

        return () => {
            // Clean up WebSocket when component unmounts
            console.log("WebSocket cleaned up.");
            newSocket.close();
        };
    }, [previousMessages]);

    // Handler to send a message
    const handleSendMesaage = (messageText) => {
        if (socket) {
            // https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
            socket.send(messageText);
        }
    };

    //--------------------------------------end handle SOCKET--------------------------------------------------
    // Function to scroll to the bottom
    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop =
                messageContainerRef.current.scrollHeight;
        }
    };

    // Use useEffect to scroll to the bottom when the component mounts
    useEffect(() => {
        scrollToBottom();
    }, [previousMessages]);

    // console.log(previousMessages)
    // console.log(previousMessages);

    return (
        <div>
            {/* <div className="grid grid-cols-1 border border-r-slate-200 bg-white content-end h-screen"> */}
            <div className="flex flex-col border border-r-slate-200 bg-white content-end h-screen">
                {/* <div className="grid grid-cols-1 bg-gradient-to-t from-cyan-700 to-blue-800 content-end h-screen"> */}
                <div>
                    <MessageBoxTop
                        recipientData={recipient_profile}
                        handleRecipientProfileClick={
                            handleRecipientProfileClick
                        }
                    />
                </div>

                {/* {clickedOnRecipient && <h1>{recipient_profile.email} </h1>} */}
                
                
                <div
                    ref={messageContainerRef}
                    className="flex flex-col h-full justify-end overflow-y-auto"
                >
                    {/* max-h-80vh for 80% of view height*/}
                    {previousMessages.length !== 0 ? (
                        previousMessages.map((message, index) => (
                            <Message
                                key={index}
                                message={message}
                                currentUserId={user_id}
                            />
                        ))
                    ) : (
                        <NoMessage />
                    )}
                </div>

                <div className="bg-white border-t-2 sticky rounded-md bottom-0">
                    <SendMessage
                        // messageInput={messageInput}
                        handleSendMesaage={handleSendMesaage}
                    />
                </div>
            </div>
        </div>
    );
};

export default Messages;
