import React, { useState } from 'react'
import '../App.css'
import axios from 'axios'
import swal from 'sweetalert'
import { Navigate } from 'react-router-dom'





export default function Register() {
    const [success, setsuccess] = useState(false)
  const [data, setdata] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    role: "",
    phonenumber: "",
    address: "",
    salary: ""
  })

  const handle_change = (e) => {
    setdata({ ...data, [e.target.name]: e.target.value })
  }
  
  const handle_submit = async (e) => {
    e.preventDefault();
    const obj = {
      fullname: {
        firstname: data.firstname,
        lastname: data.lastname
      },
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role,
      phonenumber: data.phonenumber,
      address: data.address,
      salary: data.salary,
      startdate: new Date(),
      admin: true
    }
    try {
     const res = await axios.post("http://localhost:5000/auth/register", obj);
     localStorage.setItem("access_token", null);

      swal({
        title: "Good job!",
        text: "Successfully registered!",
        icon: "success",
        button: "Ok!",
      }); 
      setsuccess(true);
    } catch (error) {
      swal("User already exists!", "Try again with another email");
    }
  }
  return (
    <>
    {success && <Navigate to="/login" replace={true} />}
      <form onChange={handle_change} onSubmit={handle_submit}>
        <div className='wrapper'>
          <div className="form">
            <input type="text" placeholder='firstname' name='firstname' value={data.firstname} />
            <input type="text" placeholder='lastname' name='lastname' value={data.lastname} />
            <input type="text" placeholder='Username' name='username' value={data.username} />
            <input type="email" placeholder='email' name='email' value={data.email} />
            <input type="password" placeholder='password' name='password' value={data.password} />
            <input type="text" placeholder='role' name='role' value={data.role} />
            <input type="text" placeholder='PhoneNumber' name='phonenumber' value={data.phonenumber} />
            <input type="text" placeholder='address' name='address' value={data.address} />
            <input type="text" placeholder='salary' name='salary' value={data.salary} />
            <button type='submit' >Register</button>
          </div>
        </div>
      </form>
    </>
  )
}
