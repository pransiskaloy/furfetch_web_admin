import "./single.scss";
import { useEffect,useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import { driverTripHeader } from "../../datatablesource";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation } from 'react-router-dom'
import {ref, onValue} from 'firebase/database'
import {db,} from "../../services/firebase.js"
import { Link } from "react-router-dom";

const SingleDriver = () => {
  const location = useLocation()
  const { uid } = location.state
  const [tripData, setTripData] = useState([]);
  const [info, setInfo] = useState([]);
 
  useEffect(() => {
    const driverRef = ref(db,'drivers/'+uid);
    const userTripRef = ref(db,'All Ride Request');
    
    onValue(driverRef, (snapshot) =>{
      const dataCheck = snapshot.val();
      if(dataCheck !== null){
        setInfo(dataCheck);
        // Object.values(dataCheck).map((dat) => {
        //   setData((oldArray) =>[...oldArray,dat])
        // });
      }
    }
    );
    onValue(userTripRef, (snapshot) =>{
      setTripData([]);
      const dataCheck = snapshot.val();
      if(dataCheck !== null){
        Object.values(dataCheck).map((dat) => {
          if(uid === dat.driverId && dat.status === "ended")
            setTripData((oldArray) =>[...oldArray,dat])
        });
      }
    }
    );
  })
  console.log(info)
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
        <div className="top">
          <div className="left">
            {/* <div className="editButton">Edit</div> */}
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{info.name}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{info.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{info.phone}</span>
                </div>
                <div className="detailItem">
                    <h3 className="itemTitle">Car Details</h3>
                  <span className="itemKey">Colo:</span>
                  <span className="itemValue"> {info.car_details.car_color}</span>
                  <span className="itemKey">Model:</span>
                  <span className="itemValue"> {info.car_details.car_model} - {info.car_details.car_number}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Type:</span>
                  <span className="itemValue"> {info.car_details.car_type}</span>
                </div>
                <div className="detailItem">
                <span className="itemKey">Model:</span>
                  <span className="itemValue"> {info.car_details.car_model} - {info.car_details.car_number}</span>
                </div>
                {/* <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">
                    Elton St. 234 Garden Yd. NewYork
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Country:</span>
                  <span className="itemValue">USA</span>
                </div> */}
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
          </div>
        </div>
        <div className="bottom">
          <div className="left">
            <h1 className="title">Last Transactions</h1>
              {/* <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" /> */}
          </div>
          <div className="right">
            <div className="datatable">
              <DataGrid
                className="datagrid"
                rows={tripData}
                columns={driverTripHeader.concat(actionColumn)}
                getRowId = {(row) => row.time}
                pageSize={9}
                rowsPerPageOptions={[9]}
                checkboxSelection
                disableSelectionOnClick
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleDriver;
