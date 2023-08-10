import React, { useState, useEffect } from 'react';
import { fetch_token } from '../fetchtoken';
import swal from 'sweetalert';
import '../App.css';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

export default function Home() {
  const [info, setinfo] = useState({});
  const [failure, setfailure] = useState(false);
  const [success, setsuccess] = useState(false);
  const [logout, setlogout] = useState(false);
  const token = fetch_token();

  const handle_logout = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/auth/logout`, { access_token: token });
      console.log(res);
      setlogout(true);
    } catch (error) {
      swal("ERROR", `${error.message}`);
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      setTimeout(() => {
        if (document.visibilityState === 'hidden') {
          handle_logout();
        }
      }, 1000*60); // Logout after 60 seconds if still hidden
    }
  };

  useEffect(() => {
    const get_data = async () => {
      try {
        const user = await axios.get(`http://localhost:5000/auth/${token}`);
        setinfo(user.data);
      } catch (error) {
        handle_logout();
        setfailure(true);
        swal("Login again", `${error.message}`);
      }
    };
    get_data();
  }, []);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    let durationInterval;
    if (info._id) {
      durationInterval = setInterval(async () => {
        try {
          const res = await axios.post(`http://localhost:5000/auth/duration`, { access_token: token });
          console.log(res);
        } catch (error) {
          setfailure(true);
          clearInterval(durationInterval); // Stop interval on error
        }
      }, 1000*60*60);
    }

    return () => {
      clearInterval(durationInterval); // Clear the interval when the component unmounts
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [info._id]);

  return (
    <>
      {(failure || logout) && <Navigate to='/login' />}
      <div className="wrapper">
        <div className="form">
          <div><h1>Details of User</h1></div>
          <div><b>Email</b>: {info.email}</div>
          <div><b>Username</b>: {info.username}</div>
          <div><b>Role</b>: {info.role}</div>
          <div><b>Phone Number</b>: {info.phonenumber}</div>
          <div><b>Address</b>: {info.address}</div>
          <div><b>Salary</b>: {info.salary}</div>
          <button onClick={handle_logout}>Logout</button>
        </div>
      </div>
    </>
  );
}
