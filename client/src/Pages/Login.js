import React, { useState } from 'react'
import '../App.css'
import axios from 'axios'
import swal from 'sweetalert'
import { Navigate } from 'react-router-dom'
import { fetch_token } from '../fetchtoken'





export default function Login() {
  const token = fetch_token();
    const [success, setsuccess] = useState(false)
  const [data, setdata] = useState({
    email: "",
    password: "",
    access_token: token
  })

  const handle_change = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value })
  }
  
  const handle_submit = async (e) => {
    e.preventDefault();
    try {
     const res = await axios.post("http://localhost:5000/auth/login", data);
     swal({
      title: "Good job!",
      text: "Successfully Logined!",
      icon: "success",
      button: "Ok!",
    }); 
     
     if(res.data !== token)
     {
      localStorage.setItem("access_token", res.data);
     }
     setsuccess(true);
      
    } catch (error) {
      swal("Invalid Credentials!", `${error.message}`);
    }
  }
  return (
    <>
    {success && <Navigate to="/" replace={true} />}
      <form onChange={handle_change} onSubmit={handle_submit}>
        <div className='wrapper'>
          <div className="form">
            <input type="email" placeholder='email' name='email' value={data.email} />
            <input type="password" placeholder='password' name='password' value={data.password} />
            <button type='submit' >Login</button>
          </div>
        </div>
      </form>
    </>
  )
}
