import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, backendUrl, navigate } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      let response;
      if (currentState === 'Sign Up') {
        // Registration flow
        response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
      } else {
        // Login flow
        response = await axios.post(backendUrl + '/api/user/login', { email, password });
      }

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        toast.success(`${currentState} successful!`);
        
        // Handle any additional logic after successful login/signup, like updating UI
      } else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.error('Error message:', error.message);
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        toast.error(error.response.data.message || 'Operation failed. Please try again.');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  useEffect(()=>{
    if (token) {
      navigate('/')
      
    }
  },[token])

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-custom-text'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-custom-bg1' />
      </div>
      {currentState === 'Login' ? '' : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type='text'
          className='w-full px-3 py-2 border border-custom-bg1'
          placeholder='Name'
          required
        />
      )}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type='email'
        className='w-full px-3 py-2 border border-custom-bg1'
        placeholder='Email'
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type='password'
        className='w-full px-3 py-2 border border-custom-bg1'
        placeholder='Password'
        required
      />
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p className='cursor-pointer'>Forgot your password?</p>
        {
          currentState === 'Login'
            ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
            : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login here</p>
        }
      </div>
      <button className='bg-custom-bg1 text-white font-light px-8 py-2 mt-4 rounded'>
        {currentState === 'Login' ? 'Sign in' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Login;
