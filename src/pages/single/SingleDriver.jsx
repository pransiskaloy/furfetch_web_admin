import "./single.scss";
import * as React from 'react';
import moment from 'moment';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useEffect,useState } from "react";
import { useLocation } from 'react-router-dom'
import PinIcon from '@mui/icons-material/PinTwoTone';
import { useNavigate } from 'react-router-dom';
import {db,} from "../../services/firebase.js"
import StarIcon from '@mui/icons-material/StarTwoTone';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import BeenhereIcon from '@mui/icons-material/Beenhere';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import PaletteIcon from '@mui/icons-material/PaletteTwoTone';
import CategoryIcon from '@mui/icons-material/CategoryTwoTone';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCarTwoTone';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import {ref, onValue, getDatabase,get,child,set} from 'firebase/database'
import Badge from '@mui/material/Badge';
import VerifiedUserIcon from '@mui/icons-material/VerifiedTwoTone';
import GppMaybeIcon from '@mui/icons-material/GppMaybeTwoTone';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTipTwoTone';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const SingleDriver = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const { driverData} = location.state
  const [tripData, setTripData] = useState([]);
  const [info,setInfo] = useState([])
  const [tripCount,setTripCount] = useState([])
  const [allTripCount,setAllTripCount] = useState([])
  const [tripCanceledCount,setTripCanceledCount] = useState([])
  const driverId = driverData.id;
  const driverTripRef = ref(db,'All Ride Request');
  let driverStat = driverData.status
  const [driverStatus, setDriverStatus] = useState(driverStat);
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleChange = (event) => {
    setDriverStatus(event.target.value);
    changeStatus(event.target.value)
  };
  
  const changeStatus = (stat) => {
    const db = getDatabase();
    set(ref(db, `drivers/${driverData.id}/status`), stat);
  }

  useEffect(() => {
    const dbRef = ref(getDatabase())
    get(child(dbRef, `drivers/${driverData.id}`)).then((snapshot) => {
      setInfo([])
      if (snapshot.exists()) {
        setInfo(snapshot.val());
      }
    }).catch((error) => {
      console.error(error);
    });

    displayTrips(driverTripRef,'all');
    
  },[driverStatus])
  
  const displayTrips = (driverTripRef,sort) => {
    onValue(driverTripRef, (snapshot) =>{
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
          if(driverId === dat.driverId ){
            allCounter++
            if(dat.status === "ended"){
              counter++
            }else{
              cancelCounter++
            }
          }
          switch (sort){
            case 'all':
              if(driverId === dat.driverId){
                setTripData((oldArray) =>[...oldArray,dat]);
              };
              break;
            case 'ended':
              if(driverId === dat.driverId && dat.status === "ended"){
                setTripData((oldArray) =>[...oldArray,dat])
              };
              break;
            case 'canceled':
              if(driverId === dat.driverId ){
                if(dat.status === "ended"){}
                else{
                  setTripData((oldArray) =>[...oldArray,dat])
                };
              }
              break;
            default:setTripData([]);
          }

        });
        setTripCount(counter)
        setAllTripCount(allCounter)
        setTripCanceledCount(cancelCounter)
      }
    });
  }

  const widgetAllTrip = {
    title: "All Trip",
    isMoney: false,
    link: <>
    <button onClick={()=>displayTrips(driverTripRef,'all')} className="widgetButton">
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
    <button onClick={()=>displayTrips(driverTripRef,'ended')} className="widgetButton">
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
    <button onClick={()=>displayTrips(driverTripRef,'canceled')} className="widgetButton">
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
            <Link to="/drivers"  style={{textDecoration: 'none'}}>
              Drivers
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
            <div className="personalInformation"> <br />
              <div className="item">
                <div className="center">
                  <div className="details">
                    <Badge 
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <div style={{boxShadow:'2px 4px 10px 1px rgba(201, 201, 201, 0.47)',background:'white',borderRadius:'50%',padding:'3px',alignItems:'center',display:'flex',flexWrap:'wrap',border:'3px solid white'}}>
                          {info.status === 'active' ?
                            <Tooltip title="Active" placement="right" arrow>
                              <VerifiedUserIcon fontSize="small" color="info"/> 
                            </Tooltip>:
                            (info.status === 'restricted' ? 
                              <Tooltip title="Restricted" placement="right" arrow>
                                  <GppMaybeIcon fontSize="small" color="error"/>
                              </Tooltip>:
                              <Tooltip title="For Approval" placement="right" arrow>
                                <PrivacyTipIcon fontSize="small" color="warning"/>
                              </Tooltip>
                            )
                          }
                        </div>
                      }
                    >
                      <Avatar className="itemImg" sx={{bgcolor: '#2196f3',fontWeight:'bolder',fontSize:'40px',alignItems:'center',display:'flex',flexWrap:'wrap'}} alt={driverData.name.toUpperCase()} src="/static/images/avatar/2.jpg" />
                    </Badge>
                  </div>
                  <div className="details">
                    <h1 className="itemTitle">{driverData.name}</h1>
                  </div>
                  <div className="details">
                    <span className="itemValue">{driverData.email}</span>
                  </div>
                  <div className="details">
                    <span className="itemValue">{driverData.phone}</span>
                  </div><br />
                  <div className="widgetRow">
                    <div className="widgetRowItem">
                      <span className="widgetRowItemTitle">TRIPS</span> <br />
                      <span className="widgetRowItemInfo">{tripCount}</span>
                    </div>
                    <div className="widgetRowItem">
                      <span className="widgetRowItemTitle">RATINGS</span> <br />
                      <div className="widgetRowItemInfoIcon">
                        <span>{info.ratings ? Number(info.ratings).toFixed(1) : '0.0'} </span> 
                        <StarIcon fontSize="small" color="info"/>
                      </div>
                    </div>
                    <div className="widgetRowItem">
                      <span className="widgetRowItemTitle">EARNINGS</span> <br />
                      <span className="widgetRowItemInfo">P {info.earnings? Number(info.earnings).toFixed(2): '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br/>
            <div className="carInformation">
              <div className="carInformationRow2">
                <div className="carInformationRowTitle">
                  {info.status === 'active' ?
                      <VerifiedUserIcon color="info"/>  :
                    (info.status === 'restricted' ?  
                    <GppMaybeIcon color="error"/> : 
                        <PrivacyTipIcon color="warning"/>  
                    )
                  } &nbsp;<span > Status </span>
                </div>
                <Button aria-describedby={id} onClick={handleClick}>
                  {info.status === 'active' ?
                    <span style={{color:'#1976D2',background:'#CBE0F5',padding:'6px',borderRadius:'8px',fontWeight:'bolder',cursor:'pointer'}}> Active </span>:
                    
                  (info.status === 'restricted' ?
                  <span style={{color:'#D53B3B',background:'#F2C1C1',padding:'6px',borderRadius:'8px',fontWeight:'bolder',cursor:'pointer'}}> Restricted </span>:
                  <span style={{color:'#F2A503',background:'#FBFBBD',padding:'6px',borderRadius:'8px',fontWeight:'bolder',cursor:'pointer'}}> For Approval </span>
                  )
                  }
                </Button>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <Typography sx={{ p: 2 }}>
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',flexWrap:'wrap',alignItems:'center'}}>
                      <strong> Current Status: </strong> 
                      {info.status === 'active' ?
                      <span style={{color:'#1976D2',background:'#CBE0F5',padding:'6px',borderRadius:'8px',fontWeight:'bolder',cursor:'default'}}> Active </span>:
                      (info.status === 'restricted' ?
                      <span style={{color:'#D53B3B',background:'#F2C1C1',padding:'6px',borderRadius:'8px',fontWeight:'bolder',cursor:'default'}}> Restricted </span>:
                      <span style={{color:'#F2A503',background:'#FBFBBD',padding:'6px',borderRadius:'8px',fontWeight:'bolder',cursor:'default'}}> For Approval </span>
                      )
                      }  

                    </div>
                  </Typography> <hr />
                  <Typography sx={{ pt: 2,pl:2,pr:2 }}><strong>Description:</strong> </Typography>
                    {info.status === 'active' ?
                      <Typography sx={{ p: 2,pl:2,pr:2 }}>Active Drivers can take ride requests.</Typography>:
                      (info.status === 'restricted' ?
                      <Typography sx={{ p: 2,pl:2,pr:2 }}>Restricted Drivers cannot take ride requests.</Typography>:
                      <Typography sx={{ p: 2,pl:2,pr:2 }}>For Approval Drivers are newly joined drivers that needs to be reviewed.</Typography>
                      )
                    } <hr />
                  <Typography sx={{p:2}}>
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                      <strong>
                        Change Status
                      </strong>
                      <div>
                      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                          value={driverStatus}
                          onChange={handleChange}
                          // displayEmpty
                          // inputProps={{ 'aria-label': 'Without label' }}
                          >
                          <MenuItem  value={'active'}>Activate</MenuItem>
                          <MenuItem value={'restricted'}>Restrict</MenuItem>
                        </Select>
                      </FormControl>

                      </div>
                    </div>
                  </Typography>
                </Popover>
              </div>
            </div>
            <br/>
            <div className="carInformation">
              <div className="carInformationRow">
                <div className="carInformationRowTitle">
                  <DirectionsCarIcon className="icon" color="primary"/> &nbsp;<span > Car Model </span>
                </div>
                <span style={{color:'#555'}}> {driverData.car_details.car_model} </span>
              </div>
              <div className="carInformationRow">
                <div className="carInformationRowTitle">
                  <PinIcon className="icon" color="warning"/> &nbsp;<span > Plate Number </span>
                </div>
                <span style={{color:'#555'}}> {driverData.car_details.car_number.toUpperCase()}</span>
              </div>
              <div className="carInformationRow">
                <div className="carInformationRowTitle">
                  <PaletteIcon className="icon" color="error"/> &nbsp;<span > Color </span>
                </div>
                <span style={{color:'#555'}}> {driverData.car_details.car_color}</span>
              </div>
              <div className="carInformationRow">
                <div className="carInformationRowTitle">
                  <CategoryIcon className="icon" color="success"/> &nbsp;<span > Type </span>
                </div>
                <span style={{color:'#555'}}> {driverData.car_details.car_type} </span>
              </div>
            </div>
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
                        <span style={{fontWeight:"bolder",fontSize:"25px"}}>{data.userName}</span>
                        <span style={{fontSize:"18px"}}>{data.destinationAddress}</span>{ data.status === "ended" ?
                        <span className="tripTagSuccess"><CheckCircleTwoToneIcon color="success" sx={{width:'15px',heigh:'15px'}}/> Successful Trip</span>:
                        <span className="tripTagCancel"><ErrorTwoToneIcon color="error" sx={{width:'15px',heigh:'15px'}}/>Canceled Trip</span>}
                      </div>
                    </div>
                    <div className="tripTileButton">
                      <span style={{fontSize:"17px"}}>{data.status === "ended" ? moment(data.end_trip.end_trip_time).format("MMM D"):moment(data.time).format("MMM D")}</span>
                      {/* <span style={{fontSize:"17px"}}>{data.status}</span> */}
                      <span style={{fontSize:"12px"}}>{data.status === "ended" ? moment(data.end_trip.end_trip_time).format("h:mm A"):moment(data.time).format("h:mm A")}</span> <br />
                      <Link to="/drivers/trip-details/" state={{ uid :data.uid,driverId: data.driverId, driverData:info }} style={{textDecoration:'none'}}>
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

export default SingleDriver;
