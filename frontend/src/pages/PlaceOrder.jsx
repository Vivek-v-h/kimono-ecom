import React, { useContext, useState, useMemo } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { currency } from '../../../Admin/src/App';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const { navigate, backendUrl, token, userId, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setFormData((data) => ({ ...data, [name]: value }));
  };

  const initPay = (order) =>{
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name:'Order Payment',
      description:'Order Payment',
      order_id:order.id,
      reciept:order.reciept,
      handler: async (response) => {
        console.log(response)
        try {
           const { data } = await axios.post(backendUrl + '/api/order/verifyRazorpay',response,{headers:{token}})
           if(data.status === 'success'){
              navigate('/orders')
              setCartItems({})
            }
        } catch (error) {
          console.log(error)
          toast.error(error)
        }
      }
    }
    const rzp =new window.Razorpay(options)
    rzp.open()
  }

  // Memoizing getCartAmount to avoid recalculating during every render
  const totalAmount = useMemo(() => {
    return getCartAmount() + delivery_fee;
  }, [getCartAmount, delivery_fee]); // Recalculate only when getCartAmount or delivery_fee change

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      // Debug the userId
      console.log("User ID in PlaceOrder:", userId);

      if (!token || !userId) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const orderData = {
        userId, // Add userId to the order data
        address: formData,
        items: orderItems,
        amount: totalAmount,
      };

      switch (method) {
        case "cod":
          try {
            const response = await axios.post(
              `${backendUrl}/api/order/place`,
              orderData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log("Response from server:", response.data);

            if (response.data.success) {
              setCartItems({});
              localStorage.removeItem("cartItems");
              toast.success("Order placed successfully");
              navigate("/orders");
            } else {
              toast.error("Failed to place order");
            }
          } catch (error) {
            console.error("Error placing order:", error.response?.data || error.message);
            toast.error("An error occurred while placing the order. Please try again.");
          }
          break;

        case "stripe":
          toast.info("Stripe payment method selected.");
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe',orderData,{headers:{token}})
          if(responseStripe.data.success){
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          }else{
            toast.error(responseStripe.data.message)
          }
          break;

        case "razorpay":
          toast.info("Razorpay payment method selected.");
          const responseRazorPay = await axios.post(backendUrl + '/api/order/razorpay',orderData,{headers:{token}}) 
          if (responseRazorPay.data.success) {
            initPay(responseRazorPay.data.order)
          }

          break;

        default:
          toast.error("Invalid payment method selected");
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while placing the order");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t border-custom-bg1">
      {/* left side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-custom-bg1 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="First name"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-custom-bg1 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          className="border border-custom-bg1 rounded py-1.5 px-3.5 w-full"
          type="email"
          placeholder="Email address "
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          className="border border-custom-bg1 rounded py-1.5 px-3.5 w-full"
          type="text"
          placeholder="Street "
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            className="border border-custom-bg1 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="City"
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            className="border border-custom-bg1 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="State"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            className="border border-custom-bg1 rounded py-1.5 px-3.5 w-full"
            type="number"
            placeholder="Zipcode"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            className="border border-custom-bg1 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          className="border border-custom-bg1 rounded py-1.5 px-3.5 w-full"
          type="number"
          placeholder="Phone"
        />
      </div>

      {/* right side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          {/* Payment method selection */}
          <div className="flex gap-3 flex-col lg:flex-row ">
            <div onClick={() => setMethod('stripe')} className="flex items-center gap-3 rounded border border-custom-bg1 p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border border-custom-bg1 rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className={'h-5 mx-4'} src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={() => setMethod('razorpay')} className="flex items-center gap-3 rounded border border-custom-bg1 p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border border-custom-bg1 rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img className={'h-5 mx-4'} src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={() => setMethod('cod')} className="flex items-center gap-3 rounded border border-custom-bg1 p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border border-custom-bg1 rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className="text-custom-text text-sm font-medium mx-4">CASH ON DELIVERY</p>
            </div>
          </div>
          <div className="w-full text-end mt-8">
            <button type="submit" className="bg-custom-bg1 text-white px-16 py-3 text-sm rounded">PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;