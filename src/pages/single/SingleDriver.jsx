import "./single.scss";
import moment from 'moment';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useEffect,useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
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
import {ref, onValue, getDatabase,get,child} from 'firebase/database'

const SingleDriver = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const { driverData } = location.state
  const [tripData, setTripData] = useState([]);
  const [info,setInfo] = useState([])
  const [tripCount,setTripCount] = useState([])
  const [allTripCount,setAllTripCount] = useState([])
  const [tripCanceledCount,setTripCanceledCount] = useState([])
  const driverId = driverData.id;
  const driverTripRef = ref(db,'All Ride Request');
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
    
  },[])
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
          allCounter++
          if(driverId === dat.driverId && dat.status === "ended"){
            counter++
          }else{
            cancelCounter++
          }
          switch (sort){
            case 'all':
              setTripData((oldArray) =>[...oldArray,dat]);
              break;
            case 'ended':
              if(driverId === dat.driverId && dat.status === "ended"){
                setTripData((oldArray) =>[...oldArray,dat])
              };
              break;
            case 'canceled':
              if(driverId === dat.driverId && dat.status === "ended"){
              }else{
                setTripData((oldArray) =>[...oldArray,dat])
              };break;
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
                  <img
                    src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                    alt=""
                    className="itemImg"
                  /> <br />
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
                        <span>{Number(info.ratings).toFixed(2)} </span> 
                        <StarIcon fontSize="small" color="info"/>
                      </div>
                    </div>
                    <div className="widgetRowItem">
                      <span className="widgetRowItemTitle">EARNINGS</span> <br />
                      <span className="widgetRowItemInfo">P{Number(info.earnings).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
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
                      <Link to="/drivers/trip/" state={{ uid :"uid" }} style={{textDecoration:'none'}}>
                        <div className="tripLink">View Trip</div>
                      </Link>
                    </div>
                  </div>
                ))}

              </div>
            </div>
            <div className="tripFooter"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleDriver;
