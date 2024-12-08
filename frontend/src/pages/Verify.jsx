import React, { useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const verify = () => {
  const { token, setCartItems, backendUrl } = useContext(ShopContext); // Get values from context
  const navigate = useNavigate(); // Hook for navigation
  const [searchParams] = useSearchParams(); // Get search parameters from URL

  // Extract 'success' and 'orderId' from URL parameters
  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  // Function to verify payment with the API
  const verifyPayment = async () => {
    if (!token) {
      toast.error("No token available.");
      return; // Exit early if no token
    }

    try {
      // Make API call to verify payment
      const response = await axios.post(
        `${backendUrl}/api/order/verifyStripe`, 
        { success, orderId },
        {
          headers: { Authorization: `Bearer ${token}` }, // Properly set Authorization header
        }
      );

      if (response.data.success) {
        // Payment successful, clear cart and redirect to orders page
        setCartItems({});
        navigate('/orders');
      } else {
        // Payment failed, redirect back to cart and show error
        toast.error("Payment verification failed.");
        navigate('/cart');
      }
    } catch (error) {
      // Handle any errors during the request
      console.error(error);
      toast.error(error.message || "An error occurred during payment verification.");
    }
  };

  // Trigger payment verification once the component mounts or when token changes
  useEffect(() => {
    if (token) {
      verifyPayment();
    }
  }, [token]); // Dependency on token to trigger payment verification when available

  return (
    <div className="verify-payment-container">
      <h1>Verifying Payment...</h1>
      {/* You could add a spinner here while the verification is in progress */}
    </div>
  );
};

// Export the component
export default verify;
