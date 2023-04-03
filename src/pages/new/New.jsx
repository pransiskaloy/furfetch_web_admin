import "./new.scss";
import * as React from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useState , useEffect} from "react";
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

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import FormHelperText from '@mui/material/FormHelperText';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const New = ({ inputs, title }) => {
  const [isError, setIsError] = useState(false)
  const [fullname, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState([])
  const [staff, setStaff] = useState([]);
  
  const vertical = "top"
  const horizontal = "right"
  const [failedMessage, setFailedMessage] = useState("s")
  const [failed, setFailed] = useState(false)
  const [success, setSuccess] = useState(false)

  const [file, setFile] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  const staffRef = ref(db,'Staff');

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };
  
  useEffect(() => {
    displayStaff(staffRef);
  },[])

  const displayStaff = (staffRefProp) => {
    setStaff([])
    onValue(staffRefProp,(snapshot) =>{
      const dataCheck = snapshot.val();
      Object.values(dataCheck).map((dat) => {
        // st.push((oldArray) =>[...oldArray,dat])
        setStaff((oldArray) =>[...oldArray,dat])
      })
    })
  }
  const validatePassword = () => {
    let isValid = true
    // if (password === ''){
    if (password !== '' && confirmPassword !== ''){
      if (password !== confirmPassword) {
        isValid = false
        setIsError(true)
      }
    }
    return isValid
  }

  const register = e => {
    if(validatePassword()) {
      setIsError(false)
      setFailed(false)
      // Create a new user with email and password using firebase
        createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
            set(ref(db, `Staff/`+ res.user.uid), {
                fullname:fullname,
                address: address,
                phone: phone,
                type: type,
                email: email,
                password: password,
                uid: res.user.uid,
            }).then(() => {
              clearInput();
              setSuccess(true);
              displayStaff(staffRef)
              // Data saved successfully!
            })
            .catch((error) => {
              setFailedMessage("Failed: Something went wrong!")
              setFailed(true)
              // The write failed...
            });
          })
        .catch(err => {setFailed(true);setFailedMessage("Failed: Email is already existing!")})
    }else{
      setIsError(true)
    }

  }
  const handleClose = () => {
    setSuccess(false)
    setFailed(false)
    setIsError(false)
  }
  const clearInput = () => {

    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setFullName('')
    setAddress('')
    setPhone('')
    setType('')
  }

  return (
    <div className="new">
      <Snackbar
        autoHideDuration={6000}
        anchorOrigin={{ vertical, horizontal }}
        open={success}
        onClose={handleClose}
        message="It went perfectly fine!"
        key={"Success"}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Staff successfully added!
        </Alert>
      </Snackbar>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical, horizontal }}
        open={failed}
        onClose={handleClose}
        message="Something went wrong!"
        key={"Error"}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {/* Error: Staff was not added! */}
          {failedMessage}
        </Alert>
      </Snackbar>
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

                <TextField sx={{width: "27ch",margin:1}} id="outlined-basic-name" placeholder="Juan Dela Cruz" label="Full Name" type="text" variant="outlined" value={fullname ?? ""} onChange={e=>setFullName(e.target.value)}/> <br />
                <TextField sx={{width: "27ch",margin:1}} id="outlined-basic-address" placeholder="Davao City" label="Address" type="address" variant="outlined" value={address ?? ""} onChange={e=>setAddress(e.target.value)}/><br />
                <TextField sx={{width: "27ch",margin:1}} id="outlined-basic-number" placeholder="09** *** ****" label="Phone" type="number" variant="outlined" value={phone ?? ""} onChange={e=>setPhone(e.target.value)}/><br />
                <TextField sx={{width: "27ch",margin:1}} id="outlined-basic-email" placeholder="example@gmail.com" type="email" label="Email" variant="outlined" value={email ?? ""} onChange={e=>setEmail(e.target.value)}/>
              <br />
                <FormControl sx={{ m: 1 }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password ?? ""}
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
                  <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
                  <OutlinedInput
                    error = {isError}
                    id={isError ? "outlined-error": "outlined-adornment-confirm-password"}
                    value = {confirmPassword ?? ""}
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
                  <FormHelperText error id="outlined-adornment-password-error">
                    {isError ? "Password does not matched!" : ""}
                  </FormHelperText>
                </FormControl> <br />
            <Button sx={{ m: .5 }} variant="contained" color="success" onClick={() => {register()}}>
              Register
            </Button>
          </div>
          <div className="newRight">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 1200 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>NAME</strong></TableCell>
                    <TableCell align="center"><strong>ADDRESS</strong></TableCell>
                    <TableCell align="center"><strong>EMAIL</strong></TableCell>
                    <TableCell align="center"><strong>CONTACT</strong></TableCell>
                    <TableCell align="center"><strong>ACTION</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {staff.map((st) => (
                    <TableRow
                      key={st.uid}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" >
                        {st.fullname}
                      </TableCell>
                      <TableCell align="center">{st.address}</TableCell>
                      <TableCell align="center">{st.email}</TableCell>
                      <TableCell align="center">{st.phone}</TableCell>
                      <TableCell align="center">
                        <Button variant="contained" color="info" onClick={() => {}}>
                          <EditIcon/> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
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
