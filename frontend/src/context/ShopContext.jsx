import { createContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = "$";
    const delivery_fee = 10;
    const backendUrl = "https://kimono-ecom-backend.onrender.com";

    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem("cartItems");
        return storedCart ? JSON.parse(storedCart) : {};
    });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const[token,setToken]=useState("");

    // Add to cart function
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error("Select Product Size");
            return;
        }
    
        let cartData = { ...cartItems };
    
        // Update cart locally
        if (cartData[itemId]) {
            cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
        } else {
            cartData[itemId] = { [size]: 1 };
        }
    
        setCartItems(cartData);
        localStorage.setItem("cartItems", JSON.stringify(cartData)); // Save to localStorage
    
        // Sync cart with backend if the user is logged in
        const token = localStorage.getItem('token');
    
        if (token) {
            try {
                const response = await axios.post(
                    `${backendUrl}/api/cart/add`,
                    { itemId, size },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
    
                if (response.data.success) {
                    toast.success('Item added to cart');
                    setCartItems(response.data.cartData); // Sync cart with backend data
                    localStorage.setItem('cartItems', JSON.stringify(response.data.cartData)); // Update localStorage with backend data
                } else {
                    toast.error(response.data.message || "Failed to add item to cart.");
                }
            } catch (error) {
                console.error("Error syncing cart with backend:", error);
                toast.error("Error syncing cart with backend");
            }
        } else {
            toast.info("You are not logged in. Cart will be stored locally.");
        }
    };
    
    

    // Remove from cart function
    const removeFromCart = async (itemId, size) => {
        let cartData = { ...cartItems };

        if (cartData[itemId] && cartData[itemId][size]) {
            delete cartData[itemId][size];
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId];
            }
            setCartItems(cartData);
            localStorage.setItem("cartItems", JSON.stringify(cartData));

            toast.success("Item removed from cart");

            // Sync cart removal with the backend if user is logged in
            if (token) {
                try {
                    await axios.post(
                        `${backendUrl}/api/cart/remove`, 
                        { itemId, size }, 
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                } catch (error) {
                    console.error("Error removing item from backend:", error);
                    toast.error("Error removing item from backend");
                }
            }
        } else {
            toast.error("Item not found in cart");
        }
    };

    // Update quantity of a cart item
    const updateQuantity = async (itemId, size, quantity) => {
        if (!cartItems[itemId] || !cartItems[itemId][size]) {
            toast.error("Item not found in cart");
            return;
        }

        if (quantity <= 0) {
            removeFromCart(itemId, size);
            return;
        }

        let cartData = { ...cartItems };
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
        localStorage.setItem("cartItems", JSON.stringify(cartData));

        toast.success("Cart updated successfully");

        // Sync cart update with the backend if user is logged in
        if (token) {
            try {
                await axios.post(
                    `${backendUrl}/api/cart/update`, 
                    { itemId, size, quantity }, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.error("Error updating cart in backend:", error);
                toast.error("Error updating cart in backend");
            }
        }
    };

    // Get total cart count
    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                totalCount += cartItems[itemId][size];
            }
        }
        return totalCount;
    };

    // Memoize the products map for faster lookup in getCartAmount
    const productMap = useMemo(() => {
        return products.reduce((map, product) => {
            map[product._id] = product;
            return map;
        }, {});
    }, [products]);

    // Get cart amount (total price)
    const getCartAmount = () => {
        let totalAmount = 0;

        for (const itemId in cartItems) {
            const itemInfo = productMap[itemId];
            if (!itemInfo) {
                console.warn(`Product with ID ${itemId} not found in products list`);
                let updatedCartItems = { ...cartItems };
                delete updatedCartItems[itemId];
                setCartItems(updatedCartItems);
                localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
                continue;
            }

            for (const size in cartItems[itemId]) {
                const quantity = cartItems[itemId][size];
                totalAmount += itemInfo.price * quantity;
            }
        }

        return totalAmount + delivery_fee;
    };

    // Fetch products data
    const getProductsData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data) {
                setProducts(response.data.products);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error(error.message);
        }
    };

    // Fetch user cart data if authenticated
    const getUserCart = async () => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            toast.error("You need to log in to access your cart.");
            navigate("/login");
            return;
        }

        try {
            const response = await axios.get(`${backendUrl}/api/cart/get`, {
                headers: { Authorization: `Bearer ${storedToken}` },
            });

            if (response.data.success) {
                setCartItems(response.data.cartData);
                localStorage.setItem("cartItems", JSON.stringify(response.data.cartData)); // Save to localStorage
            } else {
                toast.error(response.data.message || "Cart is empty or not found.");
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
                localStorage.removeItem("token");
                setToken("");
                navigate("/login");
            } 
        }
    };

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
            getUserCart();
        }
    }, []);

    const value = {
        products,
        orders, // Added orders to context
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        token,
        setToken,
    };

    return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
