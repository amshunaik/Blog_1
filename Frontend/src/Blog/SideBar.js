import React from 'react'
import { Link } from 'react-router-dom';

const SideBar = () => {
  return (
    <div className=' fixed  bg-black text-white px-16 pt-12 h-screen w-fit '>
        <h1 className='text-xl '>BLOGS</h1>
        <div className=' flex flex-col gap-4 ml-2 mt-10 text-red-800 '>
            <Link to="/"className='border-2 px-1 bg-white rounded-lg w-[120px] text-center'>All Post</Link>

            <Link to="/create" className='border-2 px-1 bg-white rounded-lg w-[120px] text-center'>Create Post</Link>

        </div>
        <div>
          
        </div>
      
    </div>
  )
}

export default SideBar
