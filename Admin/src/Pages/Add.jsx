import React, { useState } from 'react'
import { assets } from '../assets/Assets'
import axios from 'axios'
import { backendUrl } from  '../App'
import { toast } from  'react-toastify'




const Add = ({token}) => {

  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)

  const [name,setName] = useState("");
  const [description,setDescription] = useState("");
  const [price,setPrice] = useState("");
  const [category,setCategory] = useState("Men");
  const [subcategory,setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes,setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      console.log({ name, description, price, category, subcategory, bestseller, sizes });

      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("description", description);
      formdata.append("price", price);
      formdata.append("category", category);
      formdata.append("subCategory", subcategory); // Change to subCategory
      formdata.append("bestseller", bestseller);
      formdata.append("sizes", JSON.stringify(sizes));
  
      if (image1) formdata.append("image1", image1);
      if (image2) formdata.append("image2", image2);
      if (image3) formdata.append("image3", image3);
      if (image4) formdata.append("image4", image4);
  
      const response = await axios.post(
        backendUrl + "/api/product/add",
        formdata,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
          toast.success(response.data.message)
          setName('')
          setDescription('')
          setImage1(false)
          setImage2(false)
          setImage3(false)
          setImage4(false)
          setPrice('')
      }else{
        toast.error(response.data.message)
      }

    } catch (error) {
      if (error.response) {
        console.error('Server response:', error.response.data); // This will give more details about the server error
        alert(`Error: ${error.response.data.message || 'Something went wrong'}`);
      } else if (error.request) {
        console.error('Request error:', error.request); // Request was made, but no response was received
        alert('No response received from the server.');
      } else {
        console.error('An unexpected error occurred:', error.message); // Other errors
        alert(`Unexpected error: ${error.message}`);
      }
    }
  };
  

  return (
    <form onSubmit={onSubmitHandler}  className='flex flex-col w-full items-start gap-3 '>
         <div>
          <p className='mb-2'>Upload Image</p>

          <div className='flex gap-2'>
            <label htmlFor='image1'>
              <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt=''/>
              <input onChange={(e)=>setImage1(e.target.files[0])} type='file' id='image1' hidden/>
            </label>
            <label htmlFor='image2'>
              <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt=''/>
              <input onChange={(e)=>setImage2(e.target.files[0])} type='file' id='image2' hidden/>
            </label>
            <label htmlFor='image3'>
              <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt=''/>
              <input onChange={(e)=>setImage3(e.target.files[0])} type='file' id='image3' hidden/>
            </label>
            <label htmlFor='image4'>
              <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt=''/>
              <input onChange={(e)=>setImage4(e.target.files[0])} type='file' id='image4' hidden/>
            </label>
          </div>
         </div>

         <div className='w-full'>
        <p className='mb-2'>Product Name</p>
        <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 bg-yellow-100'  type='text' placeholder='Enter product name' required/>
         </div>

         <div className='w-full'>
        <p className='mb-2'>Product Description</p>
        <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 bg-yellow-100'  type='text' placeholder='write content here' required/>
         </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

        <div>
          <p className='mb-2'>Product Category</p>
          <select onChange={(e)=>setCategory(e.target.value)} className='bg-yellow-100 w-ful px-3 py-2'>
              <option className='bg-yellow-100'  value="Men">Men</option>
              <option className='bg-yellow-100' value="Women">Women</option>
              <option className='bg-yellow-100' value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className='mb-2'>Sub Category</p>
          <select onChange={(e)=>setSubCategory(e.target.value)} className='bg-yellow-100 w-ful px-3 py-2'>
              <option className='bg-yellow-100'  value="Topwear">Topwear</option>
              <option className='bg-yellow-100' value="Bottomwear">Bottomwear</option>
              <option className='bg-yellow-100' value="Winterwear">Winterwear</option>
          </select>
        </div>

          <div>
            <p className='mb-2'>Product Price</p>
            <input onChange={(e)=>setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px] bg-yellow-100' type='Number' placeholder='25' />
          </div>

        </div>

          <div>
             <p className='mb-2'>Product Sizes</p>
             <div className='flex gap-3'>
    
                <div onClick={()=>setSizes(prev => prev.includes("S") ? prev.filter(item => item !== "S") : [...prev, "S"])}>
                  <p className={`${sizes.includes("S") ? "bg-[#cd8c6a]" : "bg-[#6b4c3b]"} px-3 py-1 cursor-pointer text-white border border-[#6b4c3b] rounded`}>S</p>
                </div>

                <div onClick={()=>setSizes(prev => prev.includes("M") ? prev.filter(item => item !== "M") : [...prev, "M"])}>
                  <p className={`${sizes.includes("M") ? "bg-[#cd8c6a]" : "bg-[#6b4c3b]"} px-3 py-1 cursor-pointer text-white border border-[#6b4c3b] rounded`}>M</p>
                </div>

                <div onClick={()=>setSizes(prev => prev.includes("L") ? prev.filter(item => item !== "L") : [...prev, "L"])}>
                  <p className={`${sizes.includes("L") ? "bg-[#cd8c6a]" : "bg-[#6b4c3b]"} px-3 py-1 cursor-pointer text-white border border-[#6b4c3b] rounded`}>L</p>
                </div> 

                <div onClick={()=>setSizes(prev => prev.includes("XL") ? prev.filter(item => item !== "XL") : [...prev, "XL"])}>
                  <p className={`${sizes.includes("XL") ? "bg-[#cd8c6a]" : "bg-[#6b4c3b]"} px-3 py-1 cursor-pointer text-white border border-[#6b4c3b] rounded`}>XL</p>
                </div>

                <div onClick={()=>setSizes(prev => prev.includes("XXL") ? prev.filter(item => item !== "XXL") : [...prev, "XXL"])}>
                  <p className={`${sizes.includes("XXL") ? "bg-[#cd8c6a]" : "bg-[#6b4c3b]"} px-3 py-1 cursor-pointer text-white border border-[#6b4c3b] rounded`}>XXL</p>
                </div>
              </div>
            </div>


      <div className='flex gap-2 mt-2'>
      <input 
        onChange={(e) => setBestseller(e.target.checked)} 
        checked={bestseller} 
        className='bg-yellow-100' 
        type='checkbox' 
        id='bestseller' 
      />

        <label className='cursor-pointer' htmlFor='bestseller'>
          Add to bestseller
        </label>
      </div>
      <button type='submit' className='w-28 py-3 mt-4 bg-[#6b4c3b] text-white border border-[#6b4c3b] rounded'>ADD</button>
    </form>
  )
}

export default Add