import React, { useEffect, useState } from 'react'
import { useAuth, UserButton } from '@clerk/react'
import { IoSearch } from "react-icons/io5";
import { useUser } from "@clerk/react";
import { IoImageOutline } from "react-icons/io5";
import { IoColorPaletteOutline } from "react-icons/io5";
import { TiWeatherSunny } from "react-icons/ti";
import { FiMoon } from "react-icons/fi";
import { FaVolumeUp } from "react-icons/fa";
import { CiChat1 } from "react-icons/ci";
import ChatUser from './ChatUser';
import { FiUsers } from "react-icons/fi";
import SideBar from './SideBar';
import axios from 'axios';
import Chat from './Chat';
import SendMessage from './SendMessage';
import { IoChatbubbleOutline } from "react-icons/io5";



const ChatPage = () => {
    const { user } = useUser();
    const [activeUser, SetActiveUser] = useState({});
    const [allUsers, setAllUsers] = useState([]);
    const { getToken } = useAuth();
    const [convo,setConvo]=useState([])
    
    useEffect(() => {
        const fetchUsers = async () => {
            const token = await getToken();
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/messages/conversation`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAllUsers(response.data.conversations)
        }
        fetchUsers();
    }, [])

    useEffect(()=>{
        const fetchConversations=async()=>{
            const token = await getToken();
            const res=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/messages/${activeUser._id}`,{
                headers:{

                    Authorization: `Bearer ${token}`
                }
            });
          
            setConvo(res.data)
        }
         if (Object.keys(activeUser).length > 0) {
        fetchConversations();
    }
    },[activeUser])

    return (
        <div className='bg-slate-950 w-full h-screen flex overflow-hidden'>

            {/* SideBar */}
            <div className='border w-[30%] flex flex-col overflow-hidden'>
                <div className='flex justify-between border border-slate-200 py-3 px-2 pt-4.5 shrink-0'>
                    <div className='flex items-center gap-2'>
                        <img className='w-8 ' src="logo.png" alt="" />
                        <h1 className='font-black  text-white'>iMessage</h1>
                    </div>
                    <UserButton className="ml-auto" />
                </div>

                <div className='border border-slate-200 p-2 shrink-0'>
                    <div className='flex items-center py-2 px-4 gap-3  text-slate-100 bg-[#27272B] rounded-2xl'>
                        <IoSearch className='shrink-0 ' />
                        <input className='outline-none flex-1 ' type="text" placeholder='Search' name="" id="" />
                    </div>
                </div>

                <div className='text-white flex items-center border border-slate-200 py-3 justify-around shrink-0'>
                    <div className='flex items-center gap-2'>
                        <div className='text-xl '><CiChat1 /></div>
                        <p>Chats</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='text-xl '><FiUsers /></div>
                        <p>Users</p>
                    </div>
                </div>

                {/* Sidebar list — scrolls independently */}
                <div className='flex-1 overflow-y-auto'>
                    <SideBar SetActiveUser={SetActiveUser} user={user} allUsers={allUsers} />
                </div>
            </div>

            {/* Main Chat — fixed height, no overflow on the column itself */}
            <div className='border w-[70%] flex flex-col overflow-hidden'>

                {/* Header — never shrinks */}
                <div className='flex justify-between items-center border-slate-400 border py-1 pt-3 px-2 shrink-0'>
                    
                    {Object.keys(activeUser).length>0 ?<div className='flex gap-2'>
                        <div className='relative'>
                            <img className='w-10 rounded-full' src={activeUser?.profilePic} alt="" />
                            <div className='bg-green-500 w-1.5 h-1.5 rounded-full absolute right-0.5 bottom-0.5'></div>
                        </div>
                        <div className=''>
                            <h1 className='font-bold text-white text-lg'>{activeUser?.fullName}</h1>
                            <p className='text-slate-500 text-sm'>Offline</p>
                        </div>
                    </div>:
                    <div className='flex items-center gap-2 font-semibold'>
                        <img src="logo.png" className='w-10' alt="" />
                        <p className='text-white'>Select a conversation</p>
                    </div>
}

                    <div className='text-white flex gap-3 text-xl items-center'>
                        <IoImageOutline className='' />
                        <IoColorPaletteOutline className=' ' />
                        <div className='flex bg-[#27272B] rounded-3xl gap-1 p-1'>
                            <div className='bg-red-400 rounded-full'>
                                <TiWeatherSunny className='my-2 mx-2' />
                            </div>
                            <div className='rounded-full bg-blue-600'>
                                <FiMoon className='my-2 mx-2' />
                            </div>
                        </div>
                        <FaVolumeUp />
                    </div>
                </div>

                {/* Message area — takes remaining space and scrolls inside */}
               {Object.keys(activeUser).length>0 ? <div className='flex-1 overflow-y-auto'>
                    <Chat convo={convo} />
                </div>: <div>
                    </div>}

                <div>
                    {Object.keys(activeUser).length>0 ?<SendMessage activeUser={activeUser}/>:
                    <div className='display flex flex-col justify-center items-center h-screen'>
                           <div className='bg-[#091625] text-[#0185F7] p-5 rounded-3xl text-5xl mb-5'>
                                <IoChatbubbleOutline />
                           </div>
                           <h1 className='text-white font-semibold'>Select a chat to start</h1>
                           <p className=' text-slate-400 text-sm '>Pick a conversation from the list on the left to</p> 
                           <p className=' text-slate-400 text-sm '>read messages and reply. </p>
                           
                    </div>}
                </div>
            </div>

        </div>
    )
}

export default ChatPage