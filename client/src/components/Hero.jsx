import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Hero = () => {

const navigate = useNavigate()

  return (
        <div className='px-4 sm:px-20 xl:px-32 relative flex flex-col items-center justify-center w-full min-h-screen bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat'>
      
            <div className='text-center flex flex-col gap-6 w-full md:w-1/2 mx-auto items-center'> 
                <h1 className='text-4xl md:text-5xl font-bold'>Create amazing content with <span className='text-green-600'>MoonAI</span></h1>
        <p className='text-lg text-gray-600'>Transform your content creation with our suite of premium AI tools. Write articles, generate images, and enhance workflow.</p>
      </div>

      <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
        <button onClick={() => navigate('/ai')} className='bg-black text-white px-10 py-3 rounded-lg shadow-lg hover:scale-105 hover:bg-gray-900 active:scale-95 transition-all duration-200 cursor-pointer'>Start creating now</button>
        <button className='bg-white text-black px-10 py-3 rounded-lg border border-gray-300 shadow-sm hover:scale-105 hover:bg-gray-50 active:scale-95 transition-all duration-200 cursor-pointer'>Watch demo</button>
      </div>
      <div className='flex item-center gap-4 mt-8 mx-auto text-gray-600'>
        <img src={assets.user_group} alt="" className='h-8'/> Trusted by 100k+ users worldwide
      </div>
    </div>
  )
}

export default Hero
