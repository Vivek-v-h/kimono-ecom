import React from 'react'
import {NavLink} from  'react-router-dom'
import { assets } from '../assets/Assets'


const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2 border-[#6B4C3B]'>
        <div className='flex flex-col gap-4 pt-6 pl-[23%] text-[15px] '>

            <NavLink className='flex items-center gap-3 border border-[#6B4C3B] border-r-0 px-3 py-2 rounded-2 ' to="/add">
                <img className='w-5 h-5 ' src={assets.add_icon} alt=''/>
                <p className='hidden md:block'>Add Items</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-[#6B4C3B] border-r-0 px-3 py-2 rounded-2 ' to="/list">
                <img className='w-5 h-5 ' src={assets.order_icon} alt=''/>
                <p className='hidden md:block'>list Items</p>
            </NavLink>
            <NavLink className='flex items-center gap-3 border border-[#6B4C3B] border-r-0 px-3 py-2 rounded-2 ' to="/orders">
                <img className='w-5 h-5 ' src={assets.order_icon} alt=''/>
                <p className='hidden md:block'>Orders</p>
            </NavLink>

        </div>
    </div>
  )
}

export default Sidebar