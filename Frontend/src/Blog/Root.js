import React from 'react'
import { Outlet } from 'react-router-dom'
import MainFrame from './MainFrame'
import SideBar from './SideBar'
const Root = () => {
  return (
    <div className='flex flex-wrap '>
        <SideBar/>
        <div className=' pl-[350px] order-last pb-[20px] '>
            <Outlet/>
        </div>
 
    </div>
  )
}

export default Root
