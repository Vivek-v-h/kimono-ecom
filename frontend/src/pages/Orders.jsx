import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

const Orders = () => {
  const { currency, backendUrl, token } = useContext(ShopContext); // Get values from context
  const [orderData, setOrderData] = useState([]); // State for storing orders

  // Function to fetch order data
  const loadOrderData = async () => {
    console.log("Token inside loadOrderData:", token); // Debugging token

    if (!token) {
      console.warn("No token provided");
      return; // Exit if no token
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {}, // Request body is empty
        { headers: { Authorization: `Bearer ${token}` } } // Add Authorization header
      );
      if(response.data.success){
        let allOrdersItem = []
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            item['status']=order.status
            item['payment']=order.payment
            item['paymentMethod']=order.paymentMethod
            item['date']=order.date
            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse())
      }
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error.message);
    }
  };

  // Trigger fetch on token availability
  useEffect(() => {
    if (token) {
      loadOrderData();
    }
  }, [token]);

  return (
    <div className="border-t pt-16 border-custom-bg1">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {Array.isArray(orderData) && orderData.length > 0 ? (
          orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b border-custom-bg1 text-custom-text flex flex-col md:flex-row md:items-center gap-4"
            >
              {/* Left: Product Image and Details */}
              <div className="flex items-start gap-6 text-sm md:w-1/3">
                <img
                  className="w-16 sm:w-20"
                  src={item.image && item.image[0] ? item.image[0] : "/path/to/fallback-image.jpg"}
                  alt={item.name || "Unnamed Product"}
                />
                <div className="flex flex-col">
                  <p className="sm:text-base font-medium">{item.name || "Unnamed Product"}</p>
                  <div className="flex flex-row items-center gap-4 text-base text-custom-text">
                    <p className="text-lg">
                      {currency}
                      {item.price || "0.00"}
                    </p>
                    <p>Quantity: {item.quantity || 1}</p>
                    <p>Size: {item.size || "M"}</p>
                  </div>
                  <p className="text-sm mt-2">
                    Date: <span className="text-custom-text">{item.date || "N/A"}</span>
                  </p>
                </div>
              </div>

              {/* Middle: "Ready to Ship" Status */}
              <div className="md:flex-1 flex justify-center">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                  <p className="text-sm text-custom-text">Ready to ship</p>
                </div>
              </div>

              {/* Right: Track Order Button */}
              <div className="md:w-1/6">
                <Link to={`/track-order/${item.id}`}>
                  <button onClick={loadOrderData} className="bg-custom-bg1 hover:bg-[#8F654F] text-white text-sm px-4 py-2 rounded-md">
                    Track Order
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No orders available.</p> // Fallback message if no orders exist
        )}
      </div>
    </div>
  );
};

export default Orders;
