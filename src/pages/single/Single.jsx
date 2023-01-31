import "./single.scss";
import moment from 'moment';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useEffect,useState } from "react";
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import {db,} from "../../services/firebase.js"
import PinIcon from '@mui/icons-material/ClassTwoTone';
import PetsIcon from '@mui/icons-material/PetsTwoTone';
import Navbar from "../../components/navbar/Navbar";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Sidebar from "../../components/sidebar/Sidebar";
import BeenhereIcon from '@mui/icons-material/Beenhere';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import PaletteIcon from '@mui/icons-material/PaletteTwoTone';
import CategoryIcon from '@mui/icons-material/CategoryTwoTone';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import {ref, onValue, getDatabase,get,child} from 'firebase/database'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


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
    width: 350,
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

    
    displayTrips(userTripRef,'all');

  },[])
  const displayTrips = (userTripRef,sort) => {
    onValue(userTripRef, (snapshot) =>{
      setTripData([]);
      setTripCount([]);
      setTripCanceledCount([]);
      setAllTripCount([]);
      const dataCheck = snapshot.val();
      if(dataCheck !== null){
        let counter = 0
        let cancelCounter = 0
        let allCounter = 0
        Object.values(dataCheck).map((dat) => {
          if(userId === dat.userId ){
            allCounter++
            if(dat.status === "ended"){
              counter++
            }else{
              cancelCounter++
            }
          }
          switch (sort){
            case 'all':
            if(userId === dat.userId){
              setTripData((oldArray) =>[...oldArray,dat]);
            };
              break;
            case 'ended':
              if(userId === dat.userId && dat.status === "ended"){
                setTripData((oldArray) =>[...oldArray,dat])
              };
              break;
            case 'canceled':
              if(userId === dat.userId){
                if(dat.status === "ended"){}
                else{
                  setTripData((oldArray) =>[...oldArray,dat])
                };
              }
              break;
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
            {/* {petInfo.map((pet,index) => (
              <div className="petInformation">
              <div key={index}>
                <div className="carInformationRow" style={{display:'flex',flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',marginTop:'10px',marginBottom:'10px',padding:'10px 20px',borderRadius:'20px'}}>
                  <div className="carInformationRowTitle" style={{color: 'rgb(95, 94, 94)',display:'flex',fontWeight:'bolder',alignItems:'center',flexWrap:'wrap'}}>
                  <img
                    src="/images/pet.png"
                    alt=""
                    style={{width:'40px', height:'40px',borderRadius:'50%',objectFit:'cover'}}
                  /> &nbsp;&nbsp;<span style={{fontSize:'20px'}}> {pet.pet_name} </span>
                  </div>
                  <Button onClick={handleOpen}>View Info</Button>
                </div>
              </div>
              <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
                <Box sx={style} key={index}>
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    Pet Information
                  </Typography>
                  <div className="carInformation" key={index}>
                    <div className="carInformationRow" style={{display:'flex',flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',marginTop:'10px',marginBottom:'10px',border: '1px solid dodgerblue',padding:'10px 20px',borderRadius:'20px'}}>
                      <div className="carInformationRowTitle" style={{color: 'rgb(95, 94, 94)',display:'flex',fontWeight:'bolder',alignItems:'center',flexWrap:'wrap'}}>
                        <PetsIcon className="icon" color="primary"/> &nbsp;<span > Pet Name </span>
                      </div>
                      <span style={{color:'#555'}}> {pet.pet_name} </span>
                    </div>
                    <div className="carInformationRow" style={{display:'flex',flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',marginTop:'10px',marginBottom:'10px',border: '1px solid dodgerblue',padding:'10px 20px',borderRadius:'20px'}}>
                      <div className="carInformationRowTitle" style={{color: 'rgb(95, 94, 94)',display:'flex',fontWeight:'bolder',alignItems:'center',flexWrap:'wrap'}}>
                        <CategoryIcon className="icon" color="success"/> &nbsp;<span > Type </span>
                      </div>
                      <span style={{color:'#555'}}> {pet.pet_type} </span>
                    </div>
                    <div className="carInformationRow" style={{display:'flex',flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',marginTop:'10px',marginBottom:'10px',border: '1px solid dodgerblue',padding:'10px 20px',borderRadius:'20px'}}>
                      <div className="carInformationRowTitle" style={{color: 'rgb(95, 94, 94)',display:'flex',fontWeight:'bolder',alignItems:'center',flexWrap:'wrap'}}>
                        <PinIcon className="icon" color="warning"/> &nbsp;<span > Breed </span>
                      </div>
                      <span style={{color:'#555'}}> {pet.pet_breed}</span>
                    </div>
                    <div className="carInformationRow" style={{display:'flex',flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',marginTop:'10px',marginBottom:'10px',border: '1px solid dodgerblue',padding:'10px 20px',borderRadius:'20px'}}>
                      <div className="carInformationRowTitle" style={{color: 'rgb(95, 94, 94)',display:'flex',fontWeight:'bolder',alignItems:'center',flexWrap:'wrap'}}>
                        <PaletteIcon className="icon" color="error"/> &nbsp;<span > Color </span>
                      </div>
                      <span style={{color:'#555'}}> {pet.pet_color}</span>
                    </div>
                  </div> <br />
                  <Typography id="modal-modal-title" variant="h6" component="h4">
                    Remarks
                  </Typography>
                  <div className="carInformationRow" style={{display:'flex',flexDirection:'row',alignItems: 'center',justifyContent: 'space-between',marginTop:'10px',marginBottom:'5px',border: '1px solid grey',padding:'10px 20px',borderRadius:'20px'}}>
                      <span style={{color:'#555',padding:'10px'}}> {pet.pet_remarks}</span>
                  </div>
                </Box>
              </Modal>
              </div>
            ))} */}
          </div>
          <div className="right">
            <div className="datatableTitle">
              <div className="widgets">
                {/* TOTAL TRIPS */}
                <div className="widget">
                  <div className="leftWidget">
                    <span className="title">{widgetAllTrip.title}</span>
                    <span className="counter">
                      {widgetAllTrip.isMoney && "$"} {widgetAllTrip.amount}
                    </span>
                    
                    <span className="link2">{widgetAllTrip.link}</span>
                  </div>
                  <div className="rightWidget">
                    {widgetAllTrip.icon}
                  </div>
                </div>
                {/* SUCCESS TRIP */}
                <div className="widget">
                  <div className="leftWidget">
                    <span className="title">{widgetSuccessTrip.title}</span>
                    <span className="counter">
                      {widgetSuccessTrip.isMoney && "$"} {widgetSuccessTrip.amount}
                    </span>
                    
                    <span className="link2">{widgetSuccessTrip.link}</span>
                  </div>
                  <div className="rightWidget">
                    {widgetSuccessTrip.icon}
                  </div>
                </div>
                {/* CANCEL TRIP */}
                <div className="widget">
                  <div className="leftWidget">
                    <span className="title">{widgetCancelTrip.title}</span>
                    <span className="counter">
                      {widgetCancelTrip.isMoney && "$"} {widgetCancelTrip.amount}
                    </span>
                    
                    <span className="link2">{widgetCancelTrip.link}</span>
                  </div>
                  <div className="rightWidget">
                    {widgetCancelTrip.icon}
                  </div>
                </div>
              </div>
            </div>
            <div className="tripContainer">
              <div className="tripHeader">TRIP LIST</div>
              <div className="tripBody">

                {tripData.map((data) => (
                  <div className="tripTile">
                    <div className="tripTileTitle">
                      <Avatar sx={{ bgcolor: 'dodgerblue',width:'70px',height:'70px' }} >{"Username".substring(0, 1).toUpperCase()}</Avatar> &nbsp;&nbsp;&nbsp;
                      <div className="tripTileBody">
                        <span style={{fontWeight:"bolder",fontSize:"25px"}}>{data.driverName ? data.driverName : 'No Driver Assigned' }</span>
                        <span style={{fontSize:"18px"}}>{data.destinationAddress}</span>{ data.status === "ended" ?
                        <span className="tripTagSuccess"><CheckCircleTwoToneIcon color="success" sx={{width:'15px',heigh:'15px'}}/> SUCCESSFUL TRIP</span>:
                        <span className="tripTagCancel"><ErrorTwoToneIcon color="error" sx={{width:'15px',heigh:'15px'}}/>{data.status.toUpperCase()} TRIP</span>}
                      </div>
                    </div>
                    <div className="tripTileButton">
                      <span style={{fontSize:"17px"}}>{data.status === "ended" ? moment(data.end_trip.end_trip_time).format("MMM D"):moment(data.time).format("MMM D")}</span>
                      {/* <span style={{fontSize:"17px"}}>{data.status}</span> */}
                      <span style={{fontSize:"12px"}}>{data.status === "ended" ? moment(data.end_trip.end_trip_time).format("h:mm A"):moment(data.time).format("h:mm A")}</span> <br />
                      <Link to="/users/trip-details" state={{ uid :data.uid,driverId: data.driverId, userData:userInfo}} style={{textDecoration:'none'}}>
                        <div className="tripLink">View Trip</div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
