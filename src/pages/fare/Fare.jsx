import "./fare.scss";
import * as React from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState,useEffect }  from 'react'
import {ref, onValue,set} from 'firebase/database'
import {db,} from "../../services/firebase.js"
import Box from '@mui/material/Box';
import Input from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';



import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';


import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function createData(faretype,desc,amount) {
  return { faretype,desc,amount };
}


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const Fare = () =>{
  const [rows, setRows] = useState([]);
  const fareRef = ref(db,'BaseFare');
  const [toggleUpdate,setToggleUpdate] = useState(false);
  const [toggleAdd,setToggleAdd] = useState(false);
  const [type,setType] = useState("Fee")
  const [amount,setAmount] = useState()
  const [addAmount,setAddAmount] = useState()
  const [addFee,setAddFee] = useState("")
  const [success, setSuccess] = useState(false)
  const [addSuccess, setAddSuccess] = useState(false)
  const [failed, setFailed] = useState(false)
  const [addFailed, setAddFailed] = useState(false)


  const vertical = "top"
  const horizontal = "right"

  const [open, setOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleAddOpen = () => setAddOpen(true);
  const handleClose = () => {
    setOpen(false)
    setAddOpen(false)
    setSuccess(false)
    setFailed(false)
    setAddSuccess(false)
    setAddFailed(false)
  };


  useEffect(() => {
    baseFare(fareRef);
  },[])

  const baseFare = (fareRefProp) =>  {
    let arr = []
    onValue(fareRefProp,(snapshot) =>{
      const dataCheck = snapshot.val();
      Object.entries(dataCheck).forEach(([value,key])=>{
        arr.push(createData(value,value,key))
        console.log(value)
      })
      setRows(arr)
      // setRows([
      //   createData("Booking Fee","BookingFee",dataCheck.BookingFee),
      //   createData("Per Km","PerKm",dataCheck.PerKm),
      //   createData("Per Minute","PerMin",dataCheck.PerMin),
      //   createData("Time Frame","TimeFrame",dataCheck.TimeFrame),
      //   createData("Motorcycle","Motorcycle",dataCheck.Motorcycle),
      //   createData("Furfetch Go","Furfetch-go",dataCheck["Furfetch-go"]),
      //   createData("Furfetch X","Furfetch-x",dataCheck["Furfetch-x"]),
      // ])
    })
    arr.pop()
  }

  
  const toggleUpdateBtn = () =>{
    setToggleUpdate(true)
  }

  const toggleAddBtnCancel = () =>{
    setAddAmount()
    setAddFee()
  }
  const toggleUpdateBtnCancel = () =>{
    setToggleUpdate(false)
    handleClose()
    if(toggleUpdate){
      baseFare(fareRef)
      setType("Fee")
      setAmount(0)
    }
  }

  const handleUpdate = (passedType,passedAmount) =>{
    setType(passedType)
    setAmount(passedAmount)
    toggleUpdateBtn()
  };
  
  const handleSubmit = () => {
    set(ref(db, `BaseFare/${type}`), Number(amount)).then(() => {
      setSuccess(true);
      // Data saved successfully!
    })
    .catch((error) => {
      setFailed(true);
      // The write failed...
    });
    handleClose();

    toggleUpdateBtnCancel();
    // e.preventDefault()
  };
  const handleAddSubmit = () => {
    set(ref(db, `BaseFare/${addFee}`), Number(addAmount)).then(() => {
      setAddSuccess(true);
      // Data saved successfully!
    })
    .catch((error) => {
      setAddFailed(true);
      // The write failed...
    });
    handleClose();

    toggleUpdateBtnCancel();
    // e.preventDefault()
  };
  return (
      <div className="fare">
        <Snackbar
        autoHideDuration={6000}
        anchorOrigin={{ vertical, horizontal }}
        open={success}
        onClose={handleClose}
        message="It went perfectly fine!"
        key={"Success-Added"}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Fare successfully updated!
        </Alert>
      </Snackbar>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical, horizontal }}
        open={failed}
        onClose={handleClose}
        message="Something went wrong!"
        key={"Error-Added"}
      />
        <Snackbar
        autoHideDuration={6000}
        anchorOrigin={{ vertical, horizontal }}
        open={addSuccess}
        onClose={handleClose}
        message="It went perfectly fine!"
        key={"Success"}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Fare successfully added!
        </Alert>
      </Snackbar>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical, horizontal }}
        open={addFailed}
        onClose={handleClose}
        message="Something went wrong!"
        key={"Error"}
      />
        <Sidebar />
        <div className="fareContainer">
          <Navbar />
          <div className="fareTitle">
            <h3>List of Fare</h3>
          </div>
          <div className="fareBody">
            <div>
              <p style={{fontSize:20}}><strong>Fees</strong></p>

              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong> FARE TYPE</strong></TableCell>
                      <TableCell align="center"><strong>AMOUNT</strong></TableCell>
                      <TableCell align="center"><strong>ACTION</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow
                        key={row.faretype}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" >
                          {row.faretype}
                        </TableCell>
                        <TableCell align="center">{parseFloat(row.amount).toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <Button variant="contained" color="info" onClick={() => handleUpdate(row.desc,row.amount)}>
                            <EditIcon/> Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="update" style={{marginLeft:50,width:"40%"}}>
              <div className="addBox">
                <p style={{fontSize:20}}><strong>Add Fee</strong></p>
                <Box
                    sx={{
                      '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <Stack direction="row" justifyContent="space-between">
                      <div style={{fontSize:25,paddingTop:15}}><p>Fee</p></div>
                          <Input
                          inputProps={{ style: { textAlign: 'right' }}} 
                          required
                          type="text"
                          value={addFee ?? ''}
                          id="outlined-read-only-input"
                          placeholder="Type of Fee"
                          onChange={(e)=>setAddFee(e.target.value)}
                          />
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <div style={{fontSize:25,paddingTop:15}}><p>Amount</p></div>
                          <Input
                          inputProps={{min: 0, style: { textAlign: 'right' }}} 
                          required
                          type="number"
                          value={parseFloat(addAmount).toFixed(2) ?? ''}
                          id="outlined-read-only-input"
                          placeholder="0.00"
                          onChange={(e)=>setAddAmount(e.target.value)}
                          />
                    </Stack>
                          <br />
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      {addFee && addAmount ?
                    <> 
                      <Button variant="contained" color="success" onClick={handleAddOpen}>
                        Save
                      </Button>
                      <Button variant="outlined" color="error" onClick={() => {toggleAddBtnCancel()}}>
                        Cancel
                      </Button>
                    </> : <>
                    <Button variant="contained" disabled color="success" onClick={handleAddOpen}>
                        Save
                      </Button>
                    <Button variant="outlined" color="error" onClick={() => {toggleAddBtnCancel()}}>
                        Cancel
                      </Button>
                    </>
                    }
                    </Stack>
                  </Box>
                  <Modal
                    open={addOpen}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Confirmation
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Are you sure to add {addFee} amount?
                      </Typography> <br /> <br />
                      <Stack direction="row" spacing={2} justifyContent="flex-end">

                        <> 
                          <Button variant="contained" onClick={()=>handleAddSubmit()} color="success">
                            Save
                          </Button>
                          <Button variant="outlined" color="error" onClick={() => {toggleUpdateBtnCancel()}}>
                            Cancel
                          </Button>
                        </>

                      </Stack>
                    </Box>
                  </Modal>
              </div>
              
              <div className="updateBox">
                <p style={{fontSize:20}}><strong>Update Fee</strong></p>
                  <Box
                    sx={{
                      '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <Stack direction="row" justifyContent="space-between">
                      <div style={{fontSize:25,paddingTop:15}}><p>{type}</p></div>
                          <Input
                          inputProps={{min: 0, style: { textAlign: 'right' }}} 
                          required
                          type="number"
                          value={parseFloat(amount).toFixed(2) ?? ''}
                          id="outlined-read-only-input"
                          placeholder="0.00"
                          onChange={(e)=>setAmount(e.target.value)}
                          />
                    </Stack>
                          <br />
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      {toggleUpdate ?
                    <> 
                      <Button variant="contained" color="success" onClick={handleOpen}>
                        Update
                      </Button>
                      <Button variant="outlined" color="error" onClick={() => {toggleUpdateBtnCancel()}}>
                        Cancel
                      </Button>
                    </> : <>
                    <Button variant="contained" disabled color="success" onClick={handleOpen}>
                        Update
                      </Button>
                    <Button variant="outlined" disabled color="error" onClick={() => {toggleUpdateBtnCancel()}}>
                        Cancel
                      </Button>
                    </>
                    }
                    </Stack>
                  </Box>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        Update Confirmation
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Are you sure to update {type} amount?
                      </Typography> <br /> <br />
                      <Stack direction="row" spacing={2} justifyContent="flex-end">

                        <> 
                          <Button variant="contained" onClick={()=>handleSubmit()} color="success">
                            Update
                          </Button>
                          <Button variant="outlined" color="error" onClick={() => {toggleUpdateBtnCancel()}}>
                            Cancel
                          </Button>
                        </>

                      </Stack>
                    </Box>
                  </Modal>
              </div>
              
       
            </div>

          </div>
        </div>
      </div>
      )
}

export default Fare;

