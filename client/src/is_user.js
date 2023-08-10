import { fetch_token } from './fetchtoken';
import axios from 'axios';
import swal from 'sweetalert';
import { useEffect, useState } from 'react';

export const is_user = async()=>{

    const token = fetch_token();
      try {
        const data = await axios.get(`http://localhost:5000/auth/${token}`);
        return data.data.admin
      } catch (error) {
        return false; 
       // swal("Login again", `${error.message}`);
      }

}