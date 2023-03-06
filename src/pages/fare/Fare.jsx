import "./fare.scss";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState,useEffect,React }  from 'react'
import {ref, onValue} from 'firebase/database'
import {db,} from "../../services/firebase.js"
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

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
              <span>Base Fare Fee</span>
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
              >
                <div>
                  <TextField
                  required
                  label="Booking Fee"
                  defaultValue={data.BookingFee}
                  id="outlined-read-only-input"
                  />
                </div>
                <div>
                  <TextField
                  required
                  label="Per Km"
                  defaultValue={data.PerKm}
                  id="outlined-read-only-input"
                  />
                </div>
                <div>
                  <TextField
                  required
                  label="Per Minute"
                  defaultValue={data.PerMin}
                  id="outlined-read-only-input"
                  />
                </div>
                <div>
                  <TextField
                  required
                  label="Time Frame"
                  defaultValue={data.TimeFrame}
                  id="outlined-read-only-input"
                  />
                </div>
              </Box>
            </div>
            <div style={{marginLeft:20}}>
              <span>Base Fare per Vehicle Type </span>
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
              >
                <div>
                  <TextField
                  required
                  label="Furfetch X"
                  defaultValue={data['Furfetch-x']}
                  id="outlined-read-only-input"
                  />
                </div>
                <div>
                  <TextField
                  required
                  label="Furfetch Go"
                  defaultValue={data['Furfetch-go']}
                  id="outlined-read-only-input"
                  />
                </div>
                <div>
                  <TextField
                  required
                  label="Motorcycle"
                  defaultValue={data.Motorcycle}
                  id="outlined-read-only-input"
                  />
                </div>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="info">
                  Update
                </Button>
                <Button variant="contained" color="success">
                  Save
                </Button>

              </Stack>
            </div>
          </div>
        </div>
      </div>
      )
}
