import React, { useEffect, useState } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import { fetch_token } from '../fetchtoken'
import { Navigate } from 'react-router-dom'
import '../App.css'

export default function Admin_Home() {
    const [info, setinfo] = useState([])
    const [failure, setfailure] = useState(false)
    const token = fetch_token();
    useEffect(() => {
        const get_data = async () => {
          try {
            const user = await axios.post(`http://localhost:5000/auth/users`, {access_token: token});
            console.log(user)
            setinfo(user.data);
            console.log(user.data)
          } catch (error) {
            setfailure(true);
            swal("Login again", `${error.message}`);
          }
        };
        get_data();
      }, []);
  return (
    <>
    <div className="wrapper">
    {failure && <Navigate to="/login" />}
    <table>
        <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Salary</th>
            <th>PhoneNumber</th>
            <th>Address</th>
            <th>Salary</th>
        </tr>
        {info.map(user=>{
            return (
                <tr>
                <td>{user.user_id.username}</td>
                <td>{user.user_id.email}</td>
                <td>{user.user_id.role}</td>
                <td>{user.user_id.salary}</td>
                <td>{user.user_id.phonenumber}</td>
                <td>{user.user_id.address}</td>
                <td>{user.user_id.salary}</td>
                </tr>
            )
        }
        )}
    </table>
    </div>
    </>
  )
}
