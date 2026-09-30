import React from 'react'
import { UserButton } from '@clerk/react'
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

const ChatPage = () => {
    const { user } = useUser();
    return (
        <div className='bg-slate-950 w-full h-screen  flex'>

            {/* SideBar */}
            <div className='border w-[30%] '>
                <div className='flex  justify-between border border-slate-200 py-3 px-2 pt-4.5'>
                    <div className='flex items-center gap-2'>
                        <img className='w-8 ' src="logo.png" alt="" />
                        <h1 className='font-black  text-white'>iMessage</h1>
                    </div>


                    <UserButton className="ml-auto" />

                </div>

                <div className='border border-slate-200 p-2 '>
                    <div className='flex items-center py-2 px-4 gap-3  text-slate-100 bg-[#27272B] rounded-2xl'>
                        <IoSearch className='shrink-0 ' />
                        <input className='outline-none flex-1 ' type="text" placeholder='Search' name="" id="" />
                    </div>
                </div>

                <div className='text-white flex items-center  border border-slate-200 py-3 justify-around'>
                    <div className='flex items-center gap-2'>
                        <div className='text-xl '><CiChat1/></div>
                        <p>Chats</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='text-xl '><FiUsers /></div>
                        <p>Chats</p>
                    </div>
                    
                </div>

                <div className='border border-slate-200 py-3 px-1 h-full mt-2'>
                    <ChatUser user={user}/>
                </div>


            </div>

            {/* Main Chat */}

            <div className='border w-[70%]'>
                <div className='flex  justify-between items-center border-slate-400 border py-1 pt-3 px-2'>

                    <div className='flex  gap-2 '>
                        <div className=' relative'>
            <img className='w-10 rounded-full' src={user?.imageUrl} alt="" />
            <div className='bg-green-500 w-1.5 h-1.5 rounded-full absolute right-0.5 bottom-0.5'></div>
        </div>
                        <div className=''>
                            <h1 className='font-bold text-white text-lg'>As a Programmer</h1>
                            <p className='text-slate-500 text-sm'>Offline</p>

                        </div>
                    </div>
                    <div className='text-white flex gap-3 text-xl items-center'>
                        <IoImageOutline className='' />
                        <IoColorPaletteOutline className=' ' />
                        <div className='flex bg-[#27272B]  rounded-3xl gap-1 p-1 '>
                            <div className='bg-red-400 rounded-full'>
                                <TiWeatherSunny className=' my-2 mx-2' />
                            </div>
                            <div className=' rounded-full bg-blue-600'>
                                <FiMoon className='bg-red my-2 mx-2' />

                            </div>
                        </div>
                        <  FaVolumeUp />
                    </div>

                </div>
            </div>


        </div>
    )
}

export default ChatPage