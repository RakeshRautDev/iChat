import React from 'react'

const ChatUser = ({image,name,SetActiveUser,item}) => {
  return (
    <div className='flex mt-3 items-center px-4 gap-2 border border-slate-700 py-2 cursor-pointer' onClick={()=>SetActiveUser(item)}>
        <div className=' relative'>
            <img className='w-10 rounded-full' src={image} alt="" />
            <div className='bg-green-500 w-1.5 h-1.5 rounded-full absolute right-0.5 bottom-0.5'></div>
        </div>
        <p className=' text-white font-semibold'>{name}</p>
    </div>
  )
}

export default ChatUser