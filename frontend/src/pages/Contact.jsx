import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 border-t border-custom-bg1'>
          <Title text1={'CONTACT'} text2={'US'}/>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt=''/>
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-custom-text'>Our Store</p>
          <p className=''>Willams Station <br/> Washington, USA</p>
          <p>Tel: +123456789 <br/> Email: kimono@gmail.com </p>
          <p></p>
          <p></p>
        </div>
      </div>

      <NewsLetterBox/>

    </div>
  )
}

export default Contact