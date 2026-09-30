import './App.css'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from './component/ProtectedRoute';
import PublicRoute from './component/PublicRoute';
import AuthComponent from './component/AuthComponent';
import ChatPage from './component/ChatPage';

function App() {

   const router=createBrowserRouter([
    {path:"/",
      element:<PublicRoute>

        <AuthComponent/>
      </PublicRoute>
    },
    {
      path:"/chat",
      element:(
        <ProtectedRoute>
          <ChatPage/>
        </ProtectedRoute>
      )
    }
   ])
  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App



