import "./single.scss";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { useEffect,useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import {db,} from "../../services/firebase.js"
import PinIcon from '@mui/icons-material/ClassTwoTone';
import PetsIcon from '@mui/icons-material/Pets';
import Chart from "../../components/chart/Chart";
import Navbar from "../../components/navbar/Navbar";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Sidebar from "../../components/sidebar/Sidebar";
import BeenhereIcon from '@mui/icons-material/Beenhere';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import PaletteIcon from '@mui/icons-material/PaletteTwoTone';
import CategoryIcon from '@mui/icons-material/CategoryTwoTone';
import {ref, onValue, getDatabase,get,child} from 'firebase/database'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { display } from "@mui/system";

const Single = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const { userData } = location.state
  const [tripData, setTripData] = useState([]);
  const [userInfo,setUserInfo] = useState([]);
  const [tripCount,setTripCount] = useState([])
  const [allTripCount,setAllTripCount] = useState([])
  const [tripCanceledCount,setTripCanceledCount] = useState([])
  const [petInfo,setPetInfo] = useState([]);
  const userTripRef = ref(db,'All Ride Request');
  
  const userId = userData.uid
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
  };
  useEffect(() => {
    const dbRef = ref(getDatabase())


    get(child(dbRef, `users/${userData.uid}`)).then((snapshot) => {
      setUserInfo([])
      setPetInfo([])
      if (snapshot.exists()) {
        const dataCheck = snapshot.val();
        setUserInfo(dataCheck);
        
        Object.values(dataCheck.Pet).map((dat) => {
          setPetInfo((oldArray) =>[...oldArray,dat])
        });
      }
    }).catch((error) => {
      console.error(error);
    });

    
    // onValue(userRef, (snapshot) =>{
    //   setInfo([]);
    //   const dataCheck = snapshot.val();
    //   if(dataCheck !== null){
    //     setInfo(dataCheck);
    //     // Object.values(dataCheck).map((dat) => {
    //     //   setData((oldArray) =>[...oldArray,dat])
    //     // });
    //   }
    // }
    // );
    displayTrips(userTripRef,'all');

    onValue(userTripRef, (snapshot) =>{
      setTripData([]);
      const dataCheck = snapshot.val();
      if(dataCheck !== null){
        Object.values(dataCheck).map((dat) => {
          if(userData.uid === dat.userId && dat.status === "ended")
            setTripData((oldArray) =>[...oldArray,dat])
          
        });
      }
    }
    );
  },[])
  const displayTrips = (userTripRef,sort) => {
    onValue(userTripRef, (snapshot) =>{
      setTripData([]);
      const dataCheck = snapshot.val();
      if(dataCheck !== null){
        let counter = 0
        let cancelCounter = 0
        let allCounter = 0
        Object.values(dataCheck).map((dat) => {
          allCounter++
          if(userId === dat.userId && dat.status === "ended"){
            counter++
          }else{
            cancelCounter++
          }
          switch (sort){
            case 'all':
              setTripData((oldArray) =>[...oldArray,dat]);
              break;
            case 'ended':
              if(userId === dat.userId && dat.status === "ended"){
                setTripData((oldArray) =>[...oldArray,dat])
              };
              break;
            case 'canceled':
              if(userId === dat.userId && dat.status === "ended"){
              }else{
                setTripData((oldArray) =>[...oldArray,dat])
              };break;
            default: setTripData([]);
          }
        });
        setTripCount(counter)
        setAllTripCount(allCounter)
        setTripCanceledCount(cancelCounter)
      }
    }
    );
  }
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/trip-details" state={{ uid :params.row.uid, userData: userData, driverId: params.row.driverId }} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
          </div>
        );
      },
    },
  ];
  const widgetAllTrip = {
    title: "All Trip",
    isMoney: false,
    link: <>
    <button onClick={()=>displayTrips(userTripRef,'all')} className="widgetButton">
      Display All
    </button></>,
    amount:allTripCount,
    icon: (
      <CardTravelIcon
        className="icon"
        style={{
          backgroundColor: "rgba(218, 165, 32, 0.2)",
          color: "goldenrod",
        }}
      />
    ),
  };
  const widgetSuccessTrip = {
    title: "SUCCESSFUL TRIP",
    isMoney: false,
    amount:tripCount,
    link: <>
    <button onClick={()=>displayTrips(userTripRef,'ended')} className="widgetButton">
      Display Successful
    </button></>,
    icon: (
      <BeenhereIcon
        className="icon"
        style={{
          backgroundColor: "#BBE27C",
          color: "#668D27",
        }}
      />
    ),
  };
  const widgetCancelTrip = {
    title: "CANCELED TRIP",
    isMoney: false,
    amount:tripCanceledCount,
    link: <>
    <button onClick={()=>displayTrips(userTripRef,'canceled')} className="widgetButton">
      Display Canceled
    </button></>,
    icon: (
      <WrongLocationIcon
        className="icon"
        style={{
          backgroundColor: "#FF8D8D",
          color: "#AA3838",
        }}
      />
    ),
  };
  console.log(petInfo)
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <Button variant="text" onClick={() => navigate(-1)} className="backButton"><ArrowBackIosIcon/> Back</Button>
        <div className="breadcrumbs">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/users"  style={{textDecoration: 'none'}}>
              Users
            </Link>
            /
            <span>
              Profile
            </span>
          </Breadcrumbs>
        </div>
        <div className="top">
          <div className="left">
            {/* <div className="editButton">Edit</div> */}
            <div className="personalInformation"><br />
              <div className="item">
                <div className="center">
                  <img
                    src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                    alt=""
                    className="itemImg"
                  /> <br />
                  <div className="details">
                    <h1 className="itemTitle">{userData.name}</h1>
                  </div>
                    <div className="details">
                      <span className="itemValue">{userData.email}</span>
                    </div>
                    <div className="details">
                      <span className="itemValue">{userData.phone}</span>
                    </div>
                </div>
              </div>
            </div>
            <br />
            {petInfo.map((pet,index) => (
              <>
              <div key={index}>
                <Button onClick={handleOpen}>Open modal {index}</Button>
              </div>
              <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Pet Information
                  </Typography>
                  <div className="carInformation">
                    <div className="carInformationRow" style={{display:'flex',flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',marginTop:'20px',marginBottom:'20px'}}>
                      <div className="carInformationRowTitle" style={{color: 'rgb(95, 94, 94)',display:'flex',fontWeight:'bolder',alignItems:'center',flexWrap:'wrap'}}>
                        <PetsIcon className="icon" color="primary"/> &nbsp;<span > Pet Name </span>
                      </div>
                      <span style={{color:'#555'}}> {pet.pet_name} </span>
                    </div>
                    <div className="carInformationRow" style={{display:'flex',flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',marginTop:'20px',marginBottom:'20px'}}>
                      <div className="carInformationRowTitle" style={{color: 'rgb(95, 94, 94)',display:'flex',fontWeight:'bolder',alignItems:'center',flexWrap:'wrap'}}>
                        <CategoryIcon className="icon" color="success"/> &nbsp;<span > Type </span>
                      </div>
                      <span style={{color:'#555'}}> {pet.pet_type} </span>
                    </div>
                    <div className="carInformationRow" style={{display:'flex',flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',marginTop:'20px',marginBottom:'20px'}}>
                      <div className="carInformationRowTitle" style={{color: 'rgb(95, 94, 94)',display:'flex',fontWeight:'bolder',alignItems:'center',flexWrap:'wrap'}}>
                        <PinIcon className="icon" color="warning"/> &nbsp;<span > Breed </span>
                      </div>
                      <span style={{color:'#555'}}> {pet.pet_breed}</span>
                    </div>
                    <div className="carInformationRow" style={{display:'flex',flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',marginTop:'20px',marginBottom:'20px'}}>
                      <div className="carInformationRowTitle" style={{color: 'rgb(95, 94, 94)',display:'flex',fontWeight:'bolder',alignItems:'center',flexWrap:'wrap'}}>
                        <PaletteIcon className="icon" color="error"/> &nbsp;<span > Color </span>
                      </div>
                      <span style={{color:'#555'}}> {pet.pet_color}</span>
                    </div>
                  </div>
                  <Typography id="modal-modal-title" variant="h6" component="h4">
                    Remarks
                  </Typography> <br />
                  <Box component="span" sx={{margin: 2, p:1, border: '1px dashed grey' }}>
                    {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}> */}
                      {pet.pet_remarks}
                    {/* </Typography> */}
                  </Box>
                </Box>
              </Modal>
              </>
            ))}
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
          </div>
        </div>
        <div className="bottom">
          <div className="left">
            <h1 className="title">Trip History</h1>
              {/* <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" /> */}
          </div>
          <div className="right">
            <div className="datatable">
              {/* <DataGrid
                className="datagrid"
                rows={tripData}
                columns={userTripHeader.concat(actionColumn)}
                getRowId = {(row) => row.id}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
                disableSelectionOnClick
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
