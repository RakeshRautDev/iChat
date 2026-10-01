import React from 'react'

const ChatUser = ({ image, name, SetActiveUser, item, activeUser, onlineUsers }) => {
    const isOnline = onlineUsers?.includes(item._id);

    return (
        <div
            className={`flex mt-3 items-center px-4 gap-2 border border-slate-700 py-2 cursor-pointer ${activeUser._id === item._id ? "bg-[#0185F7]/40" : ""}`}
            onClick={() => SetActiveUser(item)}
        >
            <div className='relative'>
                <img className='w-10 rounded-full' src={image} alt="" />
                {/* Green online dot — only rendered when the user is actually online */}
                {isOnline && (
                    <div className='bg-green-500 w-2.5 h-2.5 rounded-full absolute right-0 bottom-0 border-2 border-slate-950'></div>
                )}
            </div>
            <div className='flex flex-col'>
                <p className='text-white font-semibold'>{name}</p>
                <span className={`text-xs font-medium ${isOnline ? "text-green-400" : "text-slate-500"}`}>
                    {isOnline ? "Online" : "Offline"}
                </span>
            </div>
        </div>
    );
};

export default ChatUser;