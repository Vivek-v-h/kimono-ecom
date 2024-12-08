import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Relatedproducts from '../components/Relatedproducts';


const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null); // `null` is a better default than `false`
  const [image, setImage] = useState(''); // Store the main product image
  const [size,setSize] = useState('');

  const fetchProductData = () => {
    const product = products.find(item => item._id === productId);
    if (product) {
      setProductData(product);
      setImage(product.image[0]); // Set the first image as default
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      fetchProductData();
    }
  }, [productId, products]);

  return productData ? (
    <div className='pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Image and Details */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-100'>
            {productData.image.map((item, index) => (
              <img
                src={item}
                key={index}
                onClick={() => setImage(item)} // Change image on click
                className={`w-[15%] sm:w-60 sm:mb-3 flex-shrink-0 cursor-pointer ${image === item ? 'border border-blue-500' : ''}`} // Add border to selected image
                alt={`Product Image ${index + 1}`}
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img src={image} className='w-full h-auto' alt='Selected Product' />
          </div>
        </div>

            {/* Product Info */}
            <div className='flex-1'>
              <h1 className='font-light text-2xl mt-2'>{productData.name}</h1>
              <div className='flex items-center gap-1 mt-2'>
                  <img className='w-3.5' src={assets.star_icon} alt=''/>
                  <img className='w-3.5' src={assets.star_icon} alt=''/>
                  <img className='w-3.5' src={assets.star_icon} alt=''/>
                  <img className='w-3.5' src={assets.star_icon} alt=''/>
                  <img className='w-3.5' src={assets.star_dull_icon} alt=''/>
                  <p className='pl-2'>(122)</p>
              </div>
              <p className='mt-5 text-3xl font-medium '>{currency}{productData.price}</p>
              <p className='mt-5 text-custom-text md:w-4/5 '>{productData.description}</p>
              <div className='flex flex-col gap-4 my-8 '>
                  <p className='font-medium'>Select Size</p>
                  <div className='flex gap-2'>
                    {productData.sizes.map((item,index)=>(
                      <button onClick={()=>setSize(item)} className={`rounded border border-custom-bg1 text-white py-2 px-4 bg-custom-bg1 ${item === size ? 'border-white' : ''} `} key={index}>{item}</button>
                    ))}
                  </div>
              </div>

                  <button onClick={()=>addToCart(productData._id,size)} className='bg-custom-bg1 text-white px-8 py-3 text-sm active:bg-[#A3735A] rounded'>ADD TO CART</button>    
                  <hr className='mt-8 sm:w-4/5 border-custom-bg1 ' />   
                  <div className='text-sm text-custom-text mt-5 flex flex-col gap-1'>
                      <p>100% Orginal Product.</p>
                      <p>Cash on delivery available for this  product.</p>
                      <p>Easy return and exchange  policy within 7days.</p>
                  </div>  
            </div>
      </div>
            {/*Description & Review */}
        <div className='mt-20'>
            <div className='flex'>
                    <b className='border border-custom-bg1 px-5 py-3 text-sm '>Description</b>
                    <p className='border border-custom-bg1 px-5 py-3 text-sm '>Reveiws (122)</p>
            </div>
            <div className='flex flex-col gap-4  border border-custom-bg1 rounded px-6 py-6 text-sm text-custom-text'>
                    <p>Explore our latest collection of stylish, affordable clothing for every occasion. From timeless classics to modern trends, we offer something for everyone, ensuring top-quality fabrics and perfect fits.</p>
                    <p>Shop with ease through our user-friendly store, featuring secure checkout and fast shipping. Elevate your wardrobe with the best in fashion today!</p>
            </div>
        </div>
        {/* display related products */}
          <Relatedproducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className='opacity-0'></div>
  );
};

export default Product;
