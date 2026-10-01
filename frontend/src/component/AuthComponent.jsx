import React, { useState } from 'react'


import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import { AuthHeroPattern } from './AuthHeroPattern';

const AuthComponent = () => {

    const [auth, setAuth] = useState(false);
    return (<>
        <div className='h-full flex'>
            
            <div className='bg-slate-900 p-8 relative h-full w-[40%] border border-black'>
                <AuthHeroPattern/>
                <div className='space-y-4 z-40000'>
                    <p className='uppercase text-slate-400 '>Secure Gateway</p>
                    <h1 className='font-bold text-white text-2xl'>OPEN ICHAT</h1>
                    <p className='uppercase text-slate-400 text-xs'>Chats, photos, and reactions stay in sync-sign in on the right to continue.</p>
                </div>
                <div className='  '>
                    <img src="/auth.png" className='w-80 mx-auto ' alt="" />
                </div>
                <p className='absolute bottom-10 uppercase text-slate-400'>END-TO-END SESSION ENCRYPTED IN TRANSIT</p>
            </div>

            <div className='w-[60%] bg-linear-to-br from-[#012544] to-black flex justify-center items-center '>
                <div className='  bg-linear-to-br to-[#012544] from-black rounded-2xl shadow-2xl min-w-[50%] flex flex-col justify-center items-center gap-6 text-white outline-slate-600 outline py-14 px-6'>
                    <div className=' bg-[#191C25] p-2 rounded-2xl shadow-lg'>
                        <img src="logo.png" className='w-15' alt="" />
                    </div>

                    {/* Welcome Message */}
                    {!auth && <div className='flex flex-col items-center gap-5'>

                        <p className='text-blue-400 font-semibold text-sm'>SECURE ENTRY</p>
                        <h1 className='font-black text-2xl'>Welcome to iMessage</h1>
                        <button className='bg-[#0185F7] w-full rounded-xl py-3 font-black shadow-sm shadow-[#0185F7] cursor-pointer hover:scale-102 hover:bg-[#096dc5]'   onClick={() => setAuth(true)} >Continue  →</button>
                    </div>}

                    {/* SignUp */}
                    {auth && (
    <div className="w-full max-w-sm space-y-3">
        
        <SignUpButton
            mode="modal"
            className="bg-[#0185F7] w-full rounded-xl py-3 font-black
            shadow-sm shadow-[#0185F7] cursor-pointer
            hover:scale-[1.02] hover:bg-[#096dc5]"
        >
            Sign Up
        </SignUpButton>

        <div className="flex items-center text-center">
            <div className="h-px bg-slate-700 flex-1" />

            <p className="px-3 text-slate-400 text-sm">
                Or
            </p>

            <div className="h-px bg-slate-700 flex-1" />
        </div>

        <SignInButton
            mode="modal"
            className="w-full rounded-xl py-3 font-bold
            border border-slate-600
            bg-white/5 text-white
            hover:bg-white/10 hover:border-slate-500
            hover:scale-[1.02]
            transition-all duration-200 cursor-pointer"
        >
            Log In
        </SignInButton>

    </div>
)}


                </div>
            </div>
        </div>
      
        </>
    )
}

export default AuthComponent

