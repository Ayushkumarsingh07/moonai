import React from 'react'
import { Outlet } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'  
import { X } from 'lucide-react'
import { Menu } from 'lucide-react'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import { useUser } from '@clerk/clerk-react'
import { SignIn } from '@clerk/clerk-react'

const Layout = () => {

    const navigate = useNavigate();
    const [sidebar, setSidebar] =useState(false);
    const {user} = useUser()

  return user ? (
    <div className='flex flex-col items-start justify-start h-screen'>

        <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200'>
                        <img className='h-8 w-auto sm:w-44 cursor-pointer' src={assets.logo} alt="MoonAI Logo"  onClick={() => navigate('/')} />
            {
                                sidebar 
                    ? <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-600 sm:hidden cursor-pointer'/>
                    : <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-600 sm:hidden cursor-pointer'/>
            }
        </nav>
        <div className='flex-1 w-full flex h-[calc(100vh-56px)]'>
            <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
            <div className='flex-1 bg-[#F4F7FB] p-8 overflow-auto'>
                <Outlet />
            </div>
        </div>
      
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
        <SignIn />
    </div>
  )
}

export default Layout
