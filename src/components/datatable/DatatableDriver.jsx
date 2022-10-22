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

const DatatableDriver = () => {
  
  const [data, setData] = useState([]);
  const [countDriver, setCountDriver] = useState(0);
  const [countLowRate,setLowRate] = useState(0);

  // const handleDelete = (id) => {
  //   setData(data.filter((item) => item.id !== id));
  // };

  useEffect(() => {
    const driverRef = ref(db,'drivers');
    onValue(driverRef, (snapshot) =>{
      setData([]);
      let counter = 0;
      let counterRate = 0;
      setCountDriver(0);
      const dataCheck = snapshot.val();
      if(dataCheck !== null){
        Object.values(dataCheck).map((dat) => {
          setData((oldArray) =>[...oldArray,dat])
          counter++
          if(dat.ratings === "1.0")
            counterRate++
        });
      }
      setCountDriver(counter)
      setLowRate(counterRate)
    }
    );
  },[])


  
  //temporary percentage
  const diff = 20;
  const widgetData = {
    title: "TOTAL DRIVER",
    isMoney: false,
    amount:countDriver,
    link: <></>,
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
    link: <>
    <Link to="/drivers" style={{ textDecoration: "none" }}>
      View Drivers
    </Link></>,
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
        Drivers List
        {/* <Link to="/users/new" className="link">
          Add New
        </Link> */}
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
        </div>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={driverColumns.concat(actionColumn)}
        getRowId = {(row) => row.id}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};

export default DatatableDriver;
