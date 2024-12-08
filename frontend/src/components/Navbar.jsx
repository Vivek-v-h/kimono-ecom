import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets.js'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext.jsx'

const Navbar = () => {

    const [visible,setVisible]=useState(false)

    const {setShowSearch, getCartCount, navigate, token, setToken, setCartItems} = useContext(ShopContext);

    const logout  = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
        
    }


  return (
    <div className='flex items-center justify-between py-5 font-medium'>
        <Link to='/' ><img src={assets.kimono} className='w-14 h-14' alt=''/></Link>

        <ul className='hidden sm:flex gap-5 text-sm text-custom-text'>
          
            <NavLink to='/' className='flex flex-col items-center gap-1 '>
                <p>HOME</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-black hidden'/>
            </NavLink>
            <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                <p>COLLECTION</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-black hidden'/>
            </NavLink>
            <NavLink to='/about' className='flex flex-col items-center gap-1'>
                <p>ABOUT</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-black hidden'/>
            </NavLink> 
            <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                <p>CONTACT</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-black hidden'/>
            </NavLink>
        </ul>

            <div className='flex items-center gap-6'>
                <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt=''/> 

                <div className='group relative'>
                    <img onClick={()=> token ? null : navigate('/login')} src={assets.profile_icon} className='w-5 cursor-pointer' alt=''/>
                    {/* ----- Drop down  menu ----- */}
                    {token && 
                    <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-yellow-400 text-custom-text rounded'>
                            <p className='cursor-pointer bg-yellow-400 hover:text-white'>My Profile</p>
                            <p onClick={()=>navigate('/orders')} className='cursor-pointer bg-yellow-400 hover:text-white'>Orders</p>
                            <p onClick={logout} className='cursor-pointer bg-yellow-400 hover:text-white'>Logout</p>
                        </div>
                    </div>}
                </div>
                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className='w-5 min-5' alt=''/>
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-yellow-500 text-custom-text aspect-square rounded-full text-[8px] '>{getCartCount()}</p>
                </Link>
                <img onClick={()=>setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden ' alt=''/>
            </div>
                {/* Sidebar menu for smaller screen */}
                <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-custom-bg transition-all ${visible ? 'w-full' : 'w-0'}`}>
                    <div className='flex flex-col text-custom-text'>
                        <div onClick={()=>setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                                <img className='h-4 rotate-180' src={assets.dropdown_icon} alt=''/>
                                <p>Back</p>
                        </div>
                        <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 broder' to='/'>HOME</NavLink>
                        <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 broder' to='/collection'>COLLECTION</NavLink>
                        <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 broder' to='/about'>ABOUT</NavLink>
                        <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 broder' to='/contact'>CONTACT</NavLink>
                    </div>
                </div>

    </div>
  )
}

export default Navbar