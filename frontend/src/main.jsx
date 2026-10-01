
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import  {ClerkProvider} from "@clerk/react"
import { WallpaperProvider } from './context/WallpaperContext.jsx'
import { UserContextProvider } from './context/UserContext';

createRoot(document.getElementById('root')).render(
 <ClerkProvider>
     <UserContextProvider>

<WallpaperProvider>
     <App />
</WallpaperProvider>
     </UserContextProvider>

 </ClerkProvider>
 
)
