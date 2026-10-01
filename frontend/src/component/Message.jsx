import React from 'react'

const Message = ({item,type}) => {
    const getISTTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
};
  return (
    <>
    <div className={` w-fit py-1 pr-4 pl-2 rounded-t-2xl mt-3
         ${type==="sender"?
            "rounded-l-2xl bg-[#0185F7] ml-auto ":
            "rounded-r-2xl bg-[#27272B]"} 
            `}>
        <div className={`space-y-1 ${type=="sender"?"flex flex-col items-end":""}`} >
            {item?.image && 
                <div>
                    <img className='rounded-2xl mt-2 ml-2' src={item.image} alt="" />
                </div>}
            <h1 className='text-white font-semibold text-xl'>{item.text}</h1>
            <p className={` text-sm ${type=="sender"?"text-slate-100":"text-slate-400"} `}>{getISTTime(item.createdAt)}</p>
        </div>
    </div>

    
    </>
    
  )
}

export default Message