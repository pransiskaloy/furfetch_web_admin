import "./new.scss";
import * as React from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
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
import Button from '@mui/material/Button';
import {db,} from "../../services/firebase.js"


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
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };
  
  const validatePassword = () => {
    let isValid = true
    // if (password === ''){
    if (password !== '' && confirmPassword !== ''){
      if (password !== confirmPassword) {
        isValid = false
        setError('Passwords does not match')
      }
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

            // set(ref(db, `Staff/`), Number(amount)).then(() => {
            //   setSuccess(true);
            //   // Data saved successfully!
            // })
            // .catch((error) => {
            //   // setFailed(true);
            //   // The write failed...
            // });
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
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
            <br />
            <label htmlFor="upload-photo">
              <input
                style={{ display: 'none' }}
                id="upload-photo"
                name="upload-photo"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />

                <Button variant="contained" color="primary" component="span">
                  <AddPhotoAlternateIcon className="icon" /> &nbsp; Upload
                </Button>
              <br /><br />
            </label>

                <TextField sx={{width: "27ch",margin:1}} id="outlined-basic" placeholder="Juan Dela Cruz" label="Full Name" type="text" variant="outlined" onChange={e=>setFullName(e.target.value)}/> <br />
                <TextField sx={{width: "27ch",margin:1}} id="outlined-basic" placeholder="Davao City" label="Address" type="address" variant="outlined" onChange={e=>setAddress(e.target.value)}/><br />
                <TextField sx={{width: "27ch",margin:1}} id="outlined-basic" placeholder="09** *** ****" label="Phone" type="phone" variant="outlined" onChange={e=>setPhone(e.target.value)}/><br />
                <TextField sx={{width: "27ch",margin:1}} id="outlined-basic" placeholder="example@gmail.com" type="email" label="Email" variant="outlined" onChange={e=>setEmail(e.target.value)}/>
              <br />
                <FormControl sx={{ m: 1 }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    onChange={e=>setPassword(e.target.value)}
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
                </FormControl> <br />
                <FormControl sx={{ m: 1 }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    onChange={e=>setConfirmPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password"
                  />
                </FormControl> <br />
            <Button sx={{ m: .5 }} variant="contained" color="success" >
              Register
            </Button>
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
