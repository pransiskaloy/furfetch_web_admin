import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { driverColumns} from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import {ref, onValue} from 'firebase/database'
import {db,} from "../../services/firebase.js"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import StarHalfIcon from '@mui/icons-material/StarHalf';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const DatatableDriver = () => {
  
  const [data, setData] = useState([]);
  const [countDriver, setCountDriver] = useState(0);
  const [countLowRate,setLowRate] = useState(0);
  const [countNewDriver,setNewDriver] = useState(0);
  const [countDriverDeactivated,setCountDriverDeactivated] = useState(0);
  const driverRef = ref(db,'drivers');

 
  useEffect(() => {
    drivers(driverRef,'all')
  },[])


  const drivers = (driverRef,sort)=>{
    onValue(driverRef, (snapshot) =>{
      setData([]);
      let counter = 0;
      let counterRate = 0;
      let counterDriver = 0;
      let counterDriverDeactivated = 0;
      setCountDriver(0);
      const dataCheck = snapshot.val();
      if(dataCheck !== null){
        Object.values(dataCheck).map((dat) => {
          counter++
          if(dat.ratings === "1.0")
            counterRate++
          if(dat.status === "forApproval")
            counterDriver++
          if(dat.status === "restricted")
            counterDriverDeactivated++

          switch(sort){
            case'all':setData((oldArray) =>[...oldArray,dat]);break;
            case'1.0':
              if(dat.ratings === "1.0")
                setData((oldArray) =>[...oldArray,dat]);
              break;
            case'forApproval':
              if(dat.status === "forApproval")
                setData((oldArray) =>[...oldArray,dat]);
            ;break;
            case'restricted':
              if(dat.status === "restricted")
                setData((oldArray) =>[...oldArray,dat]);
            ;break;
            default:setData([]);
          }
        });
      }
      setCountDriver(counter)
      setLowRate(counterRate)
      setNewDriver(counterDriver)
      setCountDriverDeactivated(counterDriverDeactivated)
      data = JSON.parse(JSON.stringify(data).split('"id":').join('"driverId":'));
      
      document.write(JSON.stringify(data));
      console.log(data)
    }
    );
  }

  
  //temporary percentage
  const diff = 20;
  const widgetData = {
    title: "TOTAL DRIVER",
    isMoney: false,
    amount:countDriver,
    link: <><button onClick={()=>drivers(driverRef,'all')} style={{borderBottom:'1px solid gray',background:'white',border:'none',cursor:'pointer'}}>
    Display All Drivers
  </button></>,
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
  const widgetDataRate = {
    title: "LOW RATINGS",
    isMoney: false,
    amount:countLowRate,
    link:<><button onClick={()=>drivers(driverRef,'1.0')} style={{borderBottom:'1px solid gray',background:'white',border:'none',cursor:'pointer'}}>
    Display Low Rating
  </button></>,
    icon: (
      <StarHalfIcon
        className="icon"
        style={{
          backgroundColor: "#FF8D8D",
          color: "#AA3838",
        }}
      />
    ),
  };
  const widgetDataApproval = {
    title: "PENDING APPLICATION",
    isMoney: false,
    amount:countNewDriver,
    link: <><button onClick={()=>drivers(driverRef,'forApproval')} style={{borderBottom:'1px solid gray',background:'white',border:'none',cursor:'pointer'}}>
    Display Application
  </button></>,
    icon: (
      <PersonAddIcon
        className="icon"
        style={{
          backgroundColor: "#BBE27C",
          color: "#668D27",
        }}
      />
    ),
  };
  const widgetDataDeactivated = {
    title: "RESTRICTED",
    isMoney: false,
    amount:countDriverDeactivated,
    link: <><button onClick={()=>drivers(driverRef,'restricted')} style={{borderBottom:'1px solid gray',background:'white',border:'none',cursor:'pointer'}}>
    Display Restricted
  </button></>,
    icon: (
      <PersonOffIcon
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
            <Link to="/drivers/profile" state={{ driverData :params.row }} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
          </div>
        );
      },
    },
  ];


  return (
    <div className="datatable">
        Drivers List
      <div className="datatableTitle">
        <div className="widgets">
          {/* TOTAL DRIVERS */}
          <div className="widget">
            <div className="left">
              <span className="title">{widgetData.title}</span>
              <span className="counter">
                {widgetData.isMoney && "$"} {widgetData.amount}
              </span>
              
              <span className="link2">{widgetData.link}</span>
            </div>
            <div className="right">
              <div className="percentage positive">
                <KeyboardArrowUpIcon />
                {diff} %
              </div>
              {widgetData.icon}
            </div>
          </div>
          {/* NEW DRIVERS */}
          <div className="widget">
            <div className="left">
              <span className="title">{widgetDataApproval.title}</span>
              <span className="counter">
                {widgetDataApproval.isMoney && "$"} {widgetDataApproval.amount}
              </span>
              
              <span className="link2">{widgetDataApproval.link}</span>
            </div>
            <div className="right">
              <div className="percentage positive">
                <KeyboardArrowUpIcon />
                {diff} %
              </div>
              {widgetDataApproval.icon}
            </div>
          </div>
          {/* LOW RATING DRIVERS */}
          <div className="widget">
            <div className="left">
              <span className="title">{widgetDataRate.title}</span>
              <span className="counter">
                {widgetDataRate.isMoney && "$"} {widgetDataRate.amount}
              </span>
              
              <span className="link2">{widgetDataRate.link}</span>
            </div>
            <div className="right">
              <div className="percentage positive">
                <KeyboardArrowUpIcon />
                {diff} %
              </div>
              {widgetDataRate.icon}
            </div>
          </div>
          {/* DEACTIVATED DRIVERS */}
          <div className="widget">
            <div className="left">
              <span className="title">{widgetDataDeactivated.title}</span>
              <span className="counter">
                {widgetDataDeactivated.isMoney && "$"} {widgetDataDeactivated.amount}
              </span>
              
              <span className="link2">{widgetDataDeactivated.link}</span>
            </div>
            <div className="right">
              <div className="percentage positive">
                <KeyboardArrowUpIcon />
                {diff} %
              </div>
              {widgetDataDeactivated.icon}
            </div>
          </div>
        </div>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        getRowId = {(row) => row.id}
        columns={driverColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        // checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};

export default DatatableDriver;
