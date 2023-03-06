import "./fare.scss";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState,useEffect,React }  from 'react'
import {ref, onValue} from 'firebase/database'
import {db,} from "../../services/firebase.js"
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Fare() {
  const [data, setData] = useState([]);
  const fareRef = ref(db,'BaseFare');

  useEffect(() => {
    baseFare(fareRef);
  },[])

  const baseFare = (fareRefProp) =>  {
    onValue(fareRefProp,(snapshot) =>{
      const dataCheck = snapshot.val();
      setData(dataCheck);
      console.log(dataCheck)
    })
  }
    
  return (
      <div className="fare">
        <Sidebar />
        <div className="fareContainer">
          <Navbar />
          <div className="fareTitle">
            <h3>List of Fare</h3>
          </div>
          <div className="fareBody">
            <div>
              <TextField
              required
              label="Booking Fee"
              defaultValue={data.BookingFee}
              id="outlined-read-only-input"
              InputProps={{
                readOnly: true,
              }}
              />
            </div>
            <div>
              <TextField
              required
              label="Per Km"
              defaultValue={data.PerKm}
              id="outlined-read-only-input"
              InputProps={{
                readOnly: true,
              }}
              />
            </div>
            <div>
              <TextField
              required
              label="Per Minute"
              defaultValue={data.PerMin}
              id="outlined-read-only-input"
              InputProps={{
                readOnly: true,
              }}
              />
            </div>
          </div>
        </div>
      </div>
      )
}
