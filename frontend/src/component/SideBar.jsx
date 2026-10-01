import React from 'react'
import ChatUser from './ChatUser'


const SideBar = ({user,SetActiveUser,allUsers}) => {

  return (
    <>
        <div className='border border-slate-200 py-3 px-1 h-full mt-2'>

            {
                allUsers?.length>0? allUsers.map(item=>( 
                
                <ChatUser 

                SetActiveUser={SetActiveUser}
                
                key={item._id} item={item}   name={item.fullName} image={item.profilePic}
                
                />))
                :<div>No Users available</div>
                   
            }
        </div>
    </>
  )
}

export default SideBar