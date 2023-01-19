import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import CardTravelIcon from '@mui/icons-material/CardTravel';
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { useState,useEffect } from "react";
import {ref, onValue} from 'firebase/database'
import {db,} from "../../services/firebase.js"
import { Link } from "react-router-dom";

const Widget = ({ type }) => {
  let data;

  const [countUser, setCountUser] = useState(0);
  const [countDriver, setCountDriver] = useState(0);
  const [countTrip, setCountTrip] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0.0);

  // const handleDelete = (id) => {
  //   setData(data.filter((item) => item.id !== id));
  // };

  useEffect(() => {
    const userRef = ref(db,'users');
    const driverRef = ref(db,'drivers');
    const tripRef = ref(db,'All Ride Request');

    onValue(userRef, (snapshot) =>{
      setCountUser(0);
      let counter = 0;
      const dataCheck = snapshot.val();
      if(dataCheck !== null){
        Object.values(dataCheck).map((dat) => {
          counter++;
        });
      }
      setCountUser(counter);
    }
    );
    onValue(driverRef, (snapshot) =>{
      setCountDriver(0);
      let counter = 0;
      const dataCheck = snapshot.val();
      if(dataCheck !== null){
        Object.values(dataCheck).map((dat) => {
          counter++;
        });
      }
      setCountDriver(counter);
    }
    );
    onValue(tripRef, (snapshot) =>{
      let total = 0.0;
      let count = 0;
      const dataCheck = snapshot.val();
      if(dataCheck !== null){
        Object.values(dataCheck).map((dat) => {
          count++;
          if(dat.status === "ended")
            total = total + dat.end_trip.fare_amount
        });
        setTotalEarnings(total);
        setCountTrip(count);
      }
    }
    );
  },[])

  //temporary
  const diff = 20;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: <>
        <Link to="/users" style={{ textDecoration: "none" ,color:'grey'}}>
            View Users List
        </Link>
        </>,
        amount:countUser,
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "driver":
      data = {
        title: "DRIVERS",
        isMoney: false,
        amount:countDriver,
        link: <><Link to="/drivers" style={{ textDecoration: "none" ,color:'grey'}}>
        View Drivers List
    </Link>
    </>,
        icon: (
          <DriveEtaIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "EARNINGS",
        isMoney: true,
      amount:parseFloat(totalEarnings.toFixed(2)),
        link: "",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "trip":
      data = {
        title: "TRIPS",
        isMoney: false,
        link: <><Link to="/trips" style={{ textDecoration: "none" ,color:'grey'}}>
        View Trip List
    </Link>
    </>,
        amount:countTrip,
        icon: (
          <CardTravelIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "P"} {data.amount}
        </span>
        
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
