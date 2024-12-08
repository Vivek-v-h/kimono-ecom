import React from 'react'

const NewsLetterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

  return (
    <div className='text-center'>
        <p className='text-2xl font-bold text-custom-text'>Subscribe now and get 20% off</p>
          <p className='text-custom-text mt-3'>
          Stay in Style! Subscribe for Exclusive Offers and New Arrivals.
          </p>  
          <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-[#6B4C3B] pl-3'>
            <input className='w-full sm:flex-1 outline-none' type='email' placeholder='Enter your email' required/>
            <button type='submit' className='bg-custom-bg1 text-white text-xs px-10 py-4'>SUBSCRIBE</button>
          </form>  
    </div>
  )
}

export default NewsLetterBox