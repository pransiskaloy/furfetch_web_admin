import "./single.scss";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { useEffect,useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation } from 'react-router-dom'
import PinIcon from '@mui/icons-material/PinTwoTone';
import { useNavigate } from 'react-router-dom';
import {db,} from "../../services/firebase.js"
import StarIcon from '@mui/icons-material/StarTwoTone';
import Chart from "../../components/chart/Chart";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Navbar from "../../components/navbar/Navbar";
import PaletteIcon from '@mui/icons-material/PaletteTwoTone';
import Sidebar from "../../components/sidebar/Sidebar";
import CategoryIcon from '@mui/icons-material/CategoryTwoTone';
import { driverTripHeader } from "../../datatablesource";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCarTwoTone';
import {ref, onValue, getDatabase,get,child} from 'firebase/database'

const SingleDriver = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const { driverData } = location.state
  const [tripData, setTripData] = useState([]);
  const [info,setInfo] = useState([])
  const [tripCount,setTripCount] = useState([])
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
      setTripCount([]);
      const dataCheck = snapshot.val();
      if(dataCheck !== null){
        let counter = 0
        Object.values(dataCheck).map((dat) => {
          if(driverId === dat.driverId && dat.status === "ended")
            counter++
            setTripData((oldArray) =>[...oldArray,dat])
        });
        setTripCount(counter)
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
              <hr />
              <div className="carInformationRow">
                <div className="carInformationRowTitle">
                  <PinIcon className="icon" color="warning"/> &nbsp;<span > Plate Number </span>
                </div>
                <span style={{color:'#555'}}> {driverData.car_details.car_number.toUpperCase()}</span>
              </div>
              <hr />
              <div className="carInformationRow">
                <div className="carInformationRowTitle">
                  <PaletteIcon className="icon" color="error"/> &nbsp;<span > Color </span>
                </div>
                <span style={{color:'#555'}}> {driverData.car_details.car_color}</span>
              </div>
              <hr />
              <div className="carInformationRow">
                <div className="carInformationRowTitle">
                  <CategoryIcon className="icon" color="success"/> &nbsp;<span > Type </span>
                </div>
                <span style={{color:'#555'}}> {driverData.car_details.car_type} </span>
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
