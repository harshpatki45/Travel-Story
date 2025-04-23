import React from 'react'
import ProfileInfo from './ProfileInfo'
import { useNavigate } from 'react-router-dom';


const Navbar = ({ userInfo }) => {
    const isToken = localStorage.getItem("token");
    const navigate = useNavigate();

    const onLogout =() => {
        localStorage.clear();
        navigate("/login");
    }

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 x-10'>
      <img src="/assets/images/Logo1.png" alt="travel story" className="h-9" />

     {isToken && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
    </div>
  )
}

export default Navbar;
