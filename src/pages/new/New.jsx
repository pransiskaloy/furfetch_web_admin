import "./new.scss";
import * as React from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import {auth} from '../../services/firebase'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {ref, onValue, getDatabase,get,child,set} from 'firebase/database'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TextField from '@mui/material/TextField';
import Breadcrumbs from '@mui/material/Breadcrumbs';


const New = ({ inputs, title }) => {
  const [error, setError] = useState(false)
  const [fullname, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState([])

  const [file, setFile] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  const validatePassword = () => {
    let isValid = true
    if (password === ''){
    // if (password !== '' && confirmPassword !== ''){
      // if (password !== confirmPassword) {
        isValid = false
        setError('Passwords does not match')
      // }
    }
    return isValid
  }

  const register = e => {
    e.preventDefault()
    setError('')
    console.log("validate" + validatePassword() )
    if(validatePassword()) {
      // Create a new user with email and password using firebase
        createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
            console.log("ehh")
            console.log(res.user)
            // const db = getDatabase();
            // set(ref(db, `staff/${driverData.id}/status`), e.target.value);
          })
        .catch(err => setError(err.message))
    }
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="breadcrumbs">
          <Breadcrumbs aria-label="breadcrumb">
            <span>
              Staff
            </span>
          </Breadcrumbs>
        </div>
        <div className="top">
          <div className="left">
            
              <div className="rightForm">
                <img
                  src={
                    file
                      ? URL.createObjectURL(file)
                      : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                  alt=""
                />
                <form onSubmit={register}> 
                  <div className="formInput">
                    <label htmlFor="file">
                      Image: <DriveFolderUploadOutlinedIcon className="icon" />
                    </label>
                    <input
                      type="file"
                      id="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      style={{ display: "none" }}
                    />
                  </div>
                  <TextField id="outlined-basic" placeholder="example@gmail.com" label="Email" variant="outlined" onChange={e=>setEmail(e.target.value)}/>
                  <div className="formInput">
                    <label>Password</label>
                    <input type="password" placeholder="********" onChange={e=>setPassword(e.target.value)}/>
                  </div>
                <FormControl sx={{ m: 1, width: '30ch' }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
                <button type="submit">
                  Register
                </button>
              </form>
            </div>
          </div>
          <div className="newRight"></div>
        </div>
        <div className="bottom">
          <div className="left">
            
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default New;
