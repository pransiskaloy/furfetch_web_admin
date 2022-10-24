import "./single.scss";
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

const SingleDriver = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const { driverData } = location.state
  const [tripData, setTripData] = useState([]);
  const [info,setInfo] = useState([])
  const driverId = driverData.id;
  useEffect(() => {
    const dbRef = ref(getDatabase())
    const driverTripRef = ref(db,'All Ride Request');
    get(child(dbRef, `drivers/${driverData.id}`)).then((snapshot) => {
      setInfo([])
      if (snapshot.exists()) {
        setInfo(snapshot.val());
      }
    }).catch((error) => {
      console.error(error);
    });

  
    // const updateTrip = (dataCheck2) => {
    //     Object.values(dataCheck2).map((dat) => {
    //       if(driverData.id === dat.driverId && dat.status === "ended")
    //         setTripData((oldArray) =>[...oldArray,dat])
    //     });
    // }

    onValue(driverTripRef, (snapshot) =>{
      setTripData([]);
      const dataCheck = snapshot.val();
      if(dataCheck !== null){
        Object.values(dataCheck).map((dat) => {
          if(driverId === dat.driverId && dat.status === "ended")
            setTripData((oldArray) =>[...oldArray,dat])
        });
      }
    }
    );
  },[])


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
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{driverData.name}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{driverData.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{driverData.phone}</span>
                </div>
                <div className="detailItem">
                    <h3 className="itemTitle">Car Details</h3>
                  <span className="itemKey">Color:</span>
                  <span className="itemValue"> {driverData.car_details.car_color}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Type:</span>
                  <span className="itemValue"> {driverData.car_details.car_type}</span>
                </div>
                <div className="detailItem">
                <span className="itemKey">Model:</span>
                  <span className="itemValue"> {driverData.car_details.car_model} - {driverData.car_details.car_number}</span>
                </div>
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
