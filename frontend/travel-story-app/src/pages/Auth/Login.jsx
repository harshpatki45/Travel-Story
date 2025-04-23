import React, { useState } from 'react'
import PasswordInput from '../../components/PasswordInput';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utilis/helper';
import axiosInstance from '../../utilis/axiosinstance';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null)

  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid Email address.");
      return;
    }

    if(!password){
      setError("Please enter a password");
      return;
    }

    setError("");

    // Login API call
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      // Handle successful login response
      if(response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data && 
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred while logging in.");
      }
    }
  };

  return (
    <div className="h-screen bg-cyan-50 overflow-hidden relative flex items-center justify-center">
      

    <div className="absolute right-10 -top-40 w-96 h-96 bg-cyan-100 rounded-full opacity-30 login-ui-box -z-10" />
    <div className="absolute -bottom-40 right-1/2 w-80 h-80 bg-cyan-200 rounded-full opacity-30 login-ui-box -z-10" />

      <div className='container h-screen flex items-center justify-center px-20 mx-auto'>
        <div className='w-2/4 h-[90vh] relative rounded-lg overflow-hidden shadow-lg'>
        <img src="/assets/images/Window.png" alt="Login Background" className="w-full h-full object-cover flex items-end bg-cover bg-center" />
        <div className="absolute inset-0 flex flex-col justify-end p-10 bg-black/40 text-white">
            <h4 className="text-4xl font-bold mb-3">
              Capture Your <br /> Journeys
            </h4>
            <p className="text-lg">
              Record your travel experiences and memories in your personal travel journal.
            </p>
          </div>
        </div>

        <div className='w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20'>
          <form onSubmit={handleLogin}>
            <h4 className='text-2xl font-semibold mb-7'>
              Login
            </h4>
            <input type="text" placeholder='Email' className='input-box'
            value={email}
            onChange={({target}) => {setEmail(target.value)}}
             />
            <PasswordInput 
            value={password}
            onChange={({target}) => {setPassword(target.value)}}
            />

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            <button type='submit' className='btn-primary text-white'>LOGIN</button>

            <p className='text-xs text-slate-500 text-center my-4'>Or</p>

            <button
            type='submit'
            className='btn-light'
            onClick={() => {
              navigate("/signUp");
            }}
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
