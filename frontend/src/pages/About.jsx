import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t border-custom-bg1'>
          <Title text1={'ABOUT'} text2={'US'}/>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img}  alt=''/>
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-custom-text'>
                <p>Welcome to Kimono, where modern style meets vibrant design! We create high-quality clothing that celebrates individuality and self-expression, blending contemporary aesthetics with traditional craftsmanship. Our bold colors and intricate patterns bring a fresh perspective to fashion, catering to diverse tastes and occasions.</p>
                <p>At Kimono, we prioritize sustainability and ethical practices by responsibly sourcing our materials and using eco-friendly production methods. When you choose Kimono, you’re investing in exceptional clothing and supporting a brand that values integrity and creativity. Discover how our vibrant designs can elevate your wardrobe and empower your unique story through fashion.</p>
                <b className='text-custom-text'>Our Mission</b>
                <p>Our mission is to empower self-expression through modern, high-quality clothing with vibrant designs. We are committed to sustainability and ethical practices, blending contemporary style with traditional craftsmanship to inspire confidence and individuality in every piece.</p>
          </div>
      </div>
      <div className='text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm bm-20'>
        <div className='border border-custom-bg1 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Quality Assurance:</b>
            <p>We maticulously select and vet each product to ensure it meets our stringment quality standards.</p>
        </div>
        <div className='border border-custom-bg1 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Convinience:</b>
            <p>With our user-friendly interface and hassle-free ordering process and shopping. </p>
        </div>
        <div className='border border-custom-bg1 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
            <b>Exceptional Customer Service:</b>
            <p>we provide exceptional customer service rooted in professionalism, ensuring every interaction is respectful and tailored to your needs. </p>
        </div>
      </div>
      <div className='pt-10'>
      <NewsLetterBox/>
      </div>
    </div>
  )
}

export default About