
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from "@clerk/react"

import { UserContextProvider } from './context/UserContext';
import { SocketProvider } from './context/SocketContext.jsx';

createRoot(document.getElementById('root')).render(

     <ClerkProvider>
          <SocketProvider>
               <UserContextProvider>

                 
                         <App />
                 
               </UserContextProvider>
          </SocketProvider>
     </ClerkProvider>

)
