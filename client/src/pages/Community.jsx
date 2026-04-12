import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { dummyPublishedCreationData } from '../assets/assets'
import { Heart } from 'lucide-react'
import axios from "axios";
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const Community = () => {

  const  [creations, setCreations] = useState([])
  const {user} = useUser()
  const [loading, setLoading] = useState(false)
  const {getToken} = useAuth()


  const fetchCreations = async() => {
    try {
      setLoading(true)
      const {data} = await axios.get('/api/user/get-published-creations', {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })

      if(data.success){
        setCreations(data.creations)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
    setLoading(false)
  }

  const imageLikeToggle = async(id) => {
    try {
      const {data} = await axios.post('/api/user/get-published-creations', {id}, {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })

      if(data.success){
        toast.success(data.message)
        await fetchCreations()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=> {
    if(user) {
      fetchCreations()
    }
  }, [user])

  return !loading ? (
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
              <Heart onClick={()=> imageLikeToggle(creation.id)} className={`w-5 h-5 hover:scale-110 cursor-pointer transition ${creation.likes.includes(user.id) ? 'fill-red-500 text-red-500' : 'text-white'}`}/>
            </div>
          </div>
        </div>
      ))}
     </div>
    </div>
  ) : (
    <div className='flex justify-center items-center h-full'>
      <span className='w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin'></span>
    </div>
  )
}

export default Community
