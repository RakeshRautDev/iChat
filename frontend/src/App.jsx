import './App.css'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'

function App() {
  return (
    <>
      <header className='flex gap-4 w-full h-screen bg-slate-900 justify-center items-center'>
        <Show when="signed-out">
          <SignInButton className="px-4 py-2 rounded bg-white text-2xl text-black" mode='modal'/>
          <SignUpButton className="px-4 py-2 rounded bg-white text-2xl text-black"  mode='modal'/>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
    </>
  )
}

export default App