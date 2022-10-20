import "./single.scss";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { useEffect,useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import {ref, onValue} from 'firebase/database'
import {db,} from "../../services/firebase.js"
import Chart from "../../components/chart/Chart";
import Navbar from "../../components/navbar/Navbar";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { userTripHeader} from "../../datatablesource";
import Sidebar from "../../components/sidebar/Sidebar";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const Single = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const { userData } = location.state
  const [tripData, setTripData] = useState([]);
  const [info, setInfo] = useState([]);
  useEffect(() => {
    const userRef = ref(db,'users/'+userData.uid);
    const userTripRef = ref(db,'All Ride Request');
    
    // onValue(userRef, (snapshot) =>{
    //   setInfo([]);
    //   const dataCheck = snapshot.val();
    //   if(dataCheck !== null){
    //     setInfo(dataCheck);
    //     // Object.values(dataCheck).map((dat) => {
    //     //   setData((oldArray) =>[...oldArray,dat])
    //     // });
    //   }
    // }
    // );

    onValue(userTripRef, (snapshot) =>{
      setTripData([]);
      const dataCheck = snapshot.val();
      if(dataCheck !== null){
        Object.values(dataCheck).map((dat) => {
          if(userData.uid === dat.userId && dat.status === "ended")
            setTripData((oldArray) =>[...oldArray,dat])
        });
      }
    }
    );
  },[])
  
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/trip/" state={{ uid :params.row.uid }} style={{ textDecoration: "none" }}>
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
            <Link to="/users">
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
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{userData.name}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{userData.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{userData.phone}</span>
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
            <h1 className="title">Trip History</h1>
              {/* <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" /> */}
          </div>
          <div className="right">
            <div className="datatable">
              <DataGrid
                className="datagrid"
                rows={tripData}
                columns={userTripHeader.concat(actionColumn)}
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

export default Single;
