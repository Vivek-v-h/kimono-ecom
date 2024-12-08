import React, { useContext, useEffect, useState, useNavigate } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
        const tempData = [];
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    tempData.push({
                        _id: items,
                        size: item,
                        quantity: cartItems[items][item],
                    });
                }
            }
        }
        setCartData(tempData); // Update cartData state
    }
}, [cartItems, products]);



  if (products.length === 0) {
    return <div>Loading products...</div>; // Handle loading state
  }

  return (
    <div className="border-t pt-14 border-custom-bg1">
      <div className="text-2xl mb-3">
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);

          // If productData is not found, return a fallback message and log the missing product ID for debugging
          if (!productData) {
            console.warn(`Product with ID ${item._id} not found in products list`);
            return (
              <div
                key={index}
                className="py-4 border-b border-t border-custom-bg1 text-custom-text grid grid-cols-[4fr_1fr_1fr] sm:grid-cols-[4fr_2fr_1fr] items-center gap-4"
              >
                <p>Product not found</p>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="py-4 border-b border-t border-custom-bg1 text-custom-text grid grid-cols-[4fr_1fr_1fr] sm:grid-cols-[4fr_2fr_1fr] items-center gap-4"
            >
              {/* Product Image and Details */}
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  // Check if image exists, fallback to a default image if not
                  src={productData.image && productData.image[0] ? productData.image[0] : 'path/to/default/image.jpg'}
                  alt={productData.name}
                />

                {/* Product Name and Price in a Column */}
                <div className="flex flex-col">
                  {/* Product Name */}
                  <p className="text-xs sm:text-lg font-medium">
                    {productData.name}
                  </p>

                  {/* Price and Size in a Row */}
                  <div className="flex items-center gap-4 mt-1">
                    {/* Price */}
                    <p className="text-sm sm:text-base font-normal text-gray-600">
                      {currency}
                      {productData.price}
                    </p>

                    {/* Size */}
                    <p className="px-3 py-1 text-white bg-custom-bg1 rounded text-sm font-semibold">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity Input */}
              <input
                onChange={(e) =>
                  e.target.value === '' || e.target.value === '0'
                    ? null
                    : updateQuantity(item._id, item.size, Number(e.target.value))
                }
                className="border border-custom-bg1 max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                defaultValue={item.quantity}
              />

              {/* Remove Item */}
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt="Remove item"
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button onClick={() => navigate('/placeorder')} className="rounded bg-custom-bg1 text-white text-sm my-8 px-8 py-3">
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
