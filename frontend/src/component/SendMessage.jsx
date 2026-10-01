import React, { useRef, useState } from 'react';
import { useAuth } from '@clerk/react';
import axios from 'axios';
import { IoImageOutline } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";

const SendMessage = ({ activeUser }) => {
    const inputRef = useRef(null);

    const { getToken } = useAuth();

    const [messageText, setMessageText] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!messageText.trim() && !selectedFile) {
            return;
        }

        if (!activeUser?._id) {
            return;
        }

        try {
            const formData = new FormData();

            if (messageText.trim()) {
                formData.append("text", messageText.trim());
            }

            if (selectedFile) {
                formData.append("file", selectedFile);
            }

            const token = await getToken();
            console.log(formData)

            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/messages/send/${activeUser._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(res.data);

            setMessageText("");
            setSelectedFile(null);

            inputRef.current.value = "";

        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (
            file.type.startsWith("image/") ||
            file.type.startsWith("video/")
        ) {
            setSelectedFile(file);
            console.log("Selected:", file);
        }
    };

    return (
        <form onSubmit={sendMessage}>
            <div className="flex justify-between items-center gap-2 px-3 py-2 border-t border-slate-700">

                {/* Image / Video picker */}
                <IoImageOutline
                    className="text-[#0185F7] cursor-pointer hover:text-[#76aede] hover:scale-80 text-2xl"
                    onClick={() => inputRef.current.click()}
                />

                <input
                    ref={inputRef}
                    className="hidden"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                />

                {/* Message input */}
                <input
                    type="text"
                    placeholder="iMessage"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="bg-[#27272B] flex-1 text-white py-2 px-6 rounded-3xl outline-none"
                />

                {/* Send button */}
                <button
                    type="submit"
                    className="bg-[#0185F7] text-white p-2 rounded-full cursor-pointer"
                >
                    <IoMdSend />
                </button>

            </div>
        </form>
    );
};

export default SendMessage;