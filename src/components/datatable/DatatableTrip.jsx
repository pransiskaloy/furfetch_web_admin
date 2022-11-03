import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { tripHeader} from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import {ref, onValue} from 'firebase/database'
import {db,} from "../../services/firebase.js"
import BeenhereIcon from '@mui/icons-material/Beenhere';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import WrongLocationIcon from '@mui/icons-material/WrongLocation';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const DatatableTrip = () => {
  
  const [data, setData] = useState([]);
  const [countTotalTrip, setCountTotalTrip] = useState(0);
  const [countSuccessTrip, setCountSuccessTrip] = useState(0);
  const [countCancelTrip,setCountCancelTrip] = useState(0);
  const tripRef = ref(db,'All Ride Request');

  useEffect(() => {
    trips(tripRef,'all')
  },[])

  const trips = (tripRef,sort) =>{
    onValue(tripRef, (snapshot) =>{
      setData([]);
      let counter = 0;
      let counterSuccess = 0;
      let counterCancel = 0;
      setCountSuccessTrip(0);
      const dataCheck = snapshot.val();
      if(dataCheck !== null){
        Object.values(dataCheck).map((dat) => {
          counter++
          if(dat.status === "ended"){
            counterSuccess++
          }else{
            counterCancel++
          }
          switch(sort){
            case'all':setData((oldArray) =>[...oldArray,dat]);break;
            case'ended':
              if(dat.status === "ended")
                setData((oldArray) =>[...oldArray,dat]);
              break;
            case'canceled':
              if(dat.status === "ended"){
              }else{
                setData((oldArray) =>[...oldArray,dat]);
              }
            ;break;
            default:setData([]);
          }
        });
      }
      setCountTotalTrip(counter)
      setCountSuccessTrip(counterSuccess)
      setCountCancelTrip(counterCancel)
    }
    );
  }
  //temporary percentage
  const diff = 20;
  const widgetOverall = {
    title: "OVERALL TRIP",
    isMoney: false,
    amount:countTotalTrip,
    link: <><button onClick={()=>trips(tripRef,'all')} style={{borderBottom:'1px solid gray',background:'white',border:'none',cursor:'pointer'}}>
    Display All
  </button></>,
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
  const widgetSuccess = {
    title: "SUCCESSFUL TRIP",
    isMoney: false,
    amount:countSuccessTrip,
    link: <><button onClick={()=>trips(tripRef,'ended')} style={{borderBottom:'1px solid gray',background:'white',border:'none',cursor:'pointer'}}>
    Display Successful Trips
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
  const widgetCancel = {
    title: "CANCELED TRIP",
    isMoney: false,
    amount:countCancelTrip,
    link: <><button onClick={()=>trips(tripRef,'canceled')} style={{borderBottom:'1px solid gray',background:'white',border:'none',cursor:'pointer'}}>
    Display Canceled Trips
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


  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="trip-details" state={{uid:params.row.uid, driverId:params.row.driverId, userId :params.row.userId}} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            {/* <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div> */}
          </div>
        );
      },
    },
  ];


  return (
    <div className="datatable">
        Trips List
        {/* <Link to="/users/new" className="link">
          Add New
        </Link> */}
      <div className="datatableTitle">
        <div className="widgets">
          {/* TOTAL TRIPS */}
          <div className="widget">
            <div className="left">
              <span className="title">{widgetOverall.title}</span>
              <span className="counter">
                {widgetOverall.isMoney && "$"} {widgetOverall.amount}
              </span>
              
              <span className="link2">{widgetOverall.link}</span>
            </div>
            <div className="right">
              <div className="percentage positive">
                <KeyboardArrowUpIcon />
                {diff} %
              </div>
              {widgetOverall.icon}
            </div>
          </div>
          {/* SUCCESS TRIP */}
          <div className="widget">
            <div className="left">
              <span className="title">{widgetSuccess.title}</span>
              <span className="counter">
                {widgetSuccess.isMoney && "$"} {widgetSuccess.amount}
              </span>
              
              <span className="link2">{widgetSuccess.link}</span>
            </div>
            <div className="right">
              <div className="percentage positive">
                <KeyboardArrowUpIcon />
                {diff} %
              </div>
              {widgetSuccess.icon}
            </div>
          </div>
          {/* CANCEL TRIP */}
          <div className="widget">
            <div className="left">
              <span className="title">{widgetCancel.title}</span>
              <span className="counter">
                {widgetCancel.isMoney && "$"} {widgetCancel.amount}
              </span>
              
              <span className="link2">{widgetCancel.link}</span>
            </div>
            <div className="right">
              <div className="percentage positive">
                <KeyboardArrowUpIcon />
                {diff} %
              </div>
              {widgetCancel.icon}
            </div>
          </div>
        </div>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={tripHeader.concat(actionColumn)}
        getRowId = {(row) => row.uid}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};

export default DatatableTrip;
