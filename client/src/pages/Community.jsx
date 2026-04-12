import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { dummyPublishedCreationData } from '../assets/assets'
import { Heart } from 'lucide-react'

const Community = () => {

  const  [creations, setCreations] = useState([])
  const {user} = useUser()

  const fetchCreations = async() => {
    setCreations(dummyPublishedCreationData)
  }

  useEffect(()=> {
    if(user) {
      fetchCreations()
    }
  }, [user])

  return (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
     Creations
     <div className='bg-white w-full h-full rounded-xl overflow-y-scroll p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {creations.map((creation, index) => (
        <div key={index} className='relative group w-full aspect-[4/5]'>
          <img src={creation.content} alt="" className='w-full h-full object-cover rounded-xl'/>
          <div className='absolute inset-0 flex items-end justify-between p-3 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition rounded-xl text-white'>
            <p className='text-sm hidden group-hover:block'>{creation.prompt}</p>
            <div className='flex gap-1 items-center'>
              <p>{creation.likes.length}</p>
              <Heart className={`w-5 h-5 hover:scale-110 cursor-pointer transition ${creation.likes.includes(user.id) ? 'fill-red-500 text-red-500' : 'text-white'}`}/>
            </div>
          </div>
        </div>
      ))}
     </div>
    </div>
  )
}

export default Community
