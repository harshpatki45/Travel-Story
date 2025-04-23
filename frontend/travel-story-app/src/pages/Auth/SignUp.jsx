import React, { useState } from 'react'
import PasswordInput from '../../components/PasswordInput';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utilis/helper';
import axiosInstance from '../../utilis/axiosinstance';

const SignUp = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null)

  const navigate = useNavigate();
  
  const handleSignUp = async (e) => {
    e.preventDefault();

    if(!name) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid Email address.");
      return;
    }

    if(!password){
      setError("Please enter a password");
      return;
    }

    setError("");

    // SignIn API call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
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
        <img src="/assets/images/download.jpeg" alt="Login Background" className="w-full h-full object-cover flex items-end bg-cover bg-center" />
        <div className="absolute inset-0 flex flex-col justify-end p-10 bg-black/40 text-white">
            <h4 className="text-4xl font-bold mb-3">
              Join the <br /> Adventure
            </h4>
            <p className="text-lg">
             Create an Account to start documenting your travels and preserving your memories in your personal travel journal.
            </p>
          </div>
        </div>

        <div className='w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/20'>
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl font-semibold mb-7'>
              SignUp
            </h4>
            <input type="text" placeholder='Full Name' className='input-box'
            value={name}
            onChange={({target}) => {setName(target.value)}}
             />
            <input type="text" placeholder='Email' className='input-box'
            value={email}
            onChange={({target}) => {setEmail(target.value)}}
             />
            <PasswordInput 
            value={password}
            onChange={({target}) => {setPassword(target.value)}}
            />

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            <button type='submit' className='btn-primary text-white'> CREATE ACCOUNT</button>

            <p className='text-xs text-slate-500 text-center my-4'>Or</p>

            <button
            type='submit'
            className='btn-light'
            onClick={() => {
              navigate("/login");
            }}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUp

