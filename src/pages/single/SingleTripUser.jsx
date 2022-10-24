import "./singleTrip.scss";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { useEffect,useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import {db,} from "../../services/firebase.js"
import Chart from "../../components/chart/Chart";
import Navbar from "../../components/navbar/Navbar";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Sidebar from "../../components/sidebar/Sidebar";
import { driverTripHeader } from "../../datatablesource";
import {ref, onValue, getDatabase,get,child} from 'firebase/database'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const SingleTripUser = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const { uid, userData,driverId } = location.state
  const [tripData, setTripData] = useState([]);
  const [endTrip, setEndTrip] = useState([]);
  const [chat,setChat] = useState([])
  const [driverInfo,setDriverInfo] = useState([])


  useEffect(() => {
    const dbRef = ref(getDatabase())
    get(child(dbRef, `All Ride Request/${uid}/chats`)).then((snapshot) => {
      setChat([])
      if (snapshot.exists()) {
        setChat(snapshot.val());
      }
    }).catch((error) => {
      console.error(error);
    });
    
    get(child(dbRef, `All Ride Request/${uid}`)).then((snapshot) => {
      setTripData([])
      setEndTrip([])
      if (snapshot.exists()) {
        setTripData(snapshot.val());
        Object.values(snapshot.val()).map((dat) => {
          setEndTrip((oldArray) =>[...oldArray,dat])
        });
      }
    }).catch((error) => {
      console.error(error);
    });


    get(child(dbRef, `drivers/${driverId}`)).then((snapshot) => {
      setDriverInfo([])
      if (snapshot.exists()) {
        setDriverInfo(snapshot.val());
      }
    }).catch((error) => {
      console.error(error);
    });
  },[])
console.log(driverInfo)
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/drivers/trip/" state={{ uid :params.row.id }} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
          </div>
        );
      },
    },
  ];
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <Button variant="text" onClick={() => navigate(-1)} className="backButton"><ArrowBackIosIcon/> Back</Button>
        <div className="breadcrumbs">
          <Breadcrumbs aria-label="breadcrumb">
            <Link to="/users" style={{textDecoration: 'none'}}>
              Users
            </Link>
            /
            <a href="HREF" onClick={() => navigate(-1)} style={{textDecoration: 'none',color:"black"}}>
              Profile
            </a>
            /
            <span>Trip Information</span>
          </Breadcrumbs>
        </div>
        <div className="topTrip">
          <div className="leftTrip">
            <h1 className="title">User Information</h1>
            <div className="item">
              <div className="center">
                  <img
                    src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                    alt=""
                    className="itemImg"
                  />
                <div className="details">
                  <h1 className="itemTitle">{userData.name}</h1>
                  <div className="detailItem" style={{textAlign: "center",fontSize: 18}}>
                    <span className="itemKey">{userData.email}</span>
                  </div>
                  <div className="detailItem" style={{textAlign: "center",fontSize: 17}}>
                    <span className="itemKey">{userData.phone}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="rightTrip">
            <h1 className="title">Driver Information</h1>
            <div className="item">
              <div className="center">
                  <img
                    src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                    alt=""
                    className="itemImg"
                  />
                <div className="details">
                  <h1 className="itemTitle">{driverInfo.name}</h1>
                  <div className="detailItem" style={{textAlign: "center",fontSize: 18}}>
                    <span className="itemKey">{driverInfo.email}</span>
                  </div>
                  <div className="detailItem" style={{textAlign: "center",fontSize: 17}}>
                    <span className="itemKey">{driverInfo.phone}</span>
                  </div>
                  <div className="detailItem" style={{textAlign: "center",fontSize: 17}}>
                  <Link to="/drivers/profile" state={{ driverData :driverInfo }} style={{ textDecoration: "none" }}>
                    <div className="viewButton">View Info</div>
                  </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottomTrip">
          <div className="leftTrip">
            <h1 className="title">Chats</h1>
            <div className="item">
              <div className="center">
                  <img
                    src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                    alt=""
                    className="itemImg"
                  />
                <div className="details">
                  <h1 className="itemTitle">{userData.name}</h1>
                  <div className="detailItem" style={{textAlign: "center",fontSize: 18}}>
                    <span className="itemKey">{userData.email}</span>
                  </div>
                  <div className="detailItem" style={{textAlign: "center",fontSize: 17}}>
                    <span className="itemKey">{userData.phone}</span>
                  </div>
                  <div className="detailItem" style={{textAlign: "center",fontSize: 17}}>
                    <span className="itemKey">{userData.phone}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="rightTrip">
            <div className="tripDetails">
              <div className="columnOne">
                <div className="itemInfoDetails">
                  <span className="itemInfoTitle">Ratings</span> <br />
                  <span className="itemInfo">{tripData.ratings}</span> <br />
                  <span className="itemInfoTitle">Ride Started</span> <br />
                  <span className="itemInfo">{tripData.time}</span> <br />
                  <span className="itemInfoTitle">Origin (From)</span> <br />
                  <span className="itemInfo">{tripData.originAddress}</span> <br />
                </div>
              </div>
              <div className="columnTwo">
                <div className="itemInfoDetails">
                  <span className="itemInfoTitle">Fare Amount</span> <br />
                  <span className="itemInfo">{endTrip.map(tp => {return(tp.fare_amount)})}</span> <br />
                  <span className="itemInfoTitle">Ride Ended</span> <br />
                  <span className="itemInfo">{tripData.time}</span> <br />
                  <span className="itemInfoTitle">Destination (To)</span> <br />
                  <span className="itemInfo">{tripData.destinationAddress}</span> <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTripUser;
