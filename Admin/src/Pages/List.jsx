import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {

  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list', {
        headers: {
          Authorization: `Bearer ${token}` // Pass token in Authorization header
        }
      })

      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove', 
        { id }, 
        { 
          headers: { 
            Authorization: `Bearer ${token}` // Pass token in Authorization header
          } 
        }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList() // Refresh the product list after deletion
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [token]) // Fetch products when token is available

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-x-2.5'>

        {/* ------ LIST TABLE TITLE ----- */}

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border border-[#6b4c3b] rounded bg-yellow-300 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Action</b>
        </div>

        {/* ---- Product List ---- */}
        {list.length > 0 ? list.map((item, index) => (
          <div 
            key={index} 
            className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border border-[#6b4c3b] rounded bg-yellow-100 text-sm mb-1'
          >
            <img 
              src={item.image && item.image[0] ? item.image[0] : '/placeholder-image.png'} 
              alt={item.name} 
              className='w-14 h-14 object-cover' 
            />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <p 
              onClick={() => removeProduct(item._id)} 
              className='text-right md:text-center cursor-pointer text-lg text-red-600'
            >
              X
            </p>
          </div>
        )) : <p>No products available.</p>}
      </div>
    </>
  )
}

export default List
