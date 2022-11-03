import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import moment from 'moment';

export const userColumns = [
  { field: "uid", headerName: "ID", width: 280,hide:true },
  {
    field: "name",
    headerName: "User",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <Avatar sx={{ bgcolor: 'dodgerblue' }}>{params.row.name.substring(0, 1).toUpperCase()}</Avatar> &nbsp;&nbsp;
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.name}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
  },
  {
    field: "date_created",
    headerName: "Date Created",
    width: 220,
    valueFormatter: params => 
    moment(params?.value).format("Do MMM YYYY, h:mm A"),
  },

  {
    field: "phone",
    headerName: "Phone",
    width: 110,
  },
  {
    field: "status",
    headerName: "Status",
    width: 80,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];
export const driverColumns = [
  { field: "id", headerName: "ID", width: 280,hide:true },
  {
    field: "name",
    headerName: "User",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <Avatar sx={{ bgcolor: 'dodgerblue' }}>{params.row.name.substring(0, 1).toUpperCase()}</Avatar> &nbsp;&nbsp;
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.name}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
  },
  {
    field: "date_created",
    headerName: "Date Created",
    width: 220,
    valueFormatter: params => 
    moment(params?.value).format("Do MMM YYYY, h:mm A"),
  },

  {
    field: "phone",
    headerName: "Phone",
    width: 110,
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status === "forApproval" ? 'For Approval' : (params.row.status === "restricted" ? "Restricted": "Active")}
        </div>
      );
    },
  },
];

export const userTripHeader = [
  { field: "uid", headerName: "ID", width: 280,hide:true },
  { field: "driverId", headerName: "ID", width: 280,hide:true },
  { field: "time", headerName: "Date", width: 180,valueFormatter: params => 
  moment(params?.value).format("Do MMM YYYY, h:mm A"), },
  {
    field: "driverName",
    headerName: "Driver",
    width: 170,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <Avatar sx={{ bgcolor: 'dodgerblue' }}>{params.row.driverName.substring(0, 1).toUpperCase()}</Avatar> &nbsp;&nbsp;
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.driverName}
        </div>
      );
    },
  },
  {
    field: "originAddress",
    headerName: "From",
    width: 230,
  },
  {
    field: "destinationAddress",
    headerName: "To",
    width: 230,
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];
export const driverTripHeader = [
  { field: "uid", headerName: "ID", width: 280,hide:true },
  { field: "time", headerName: "Date", width: 180,valueFormatter: params => 
  moment(params?.value).format("Do MMM YYYY, h:mm A"), },
  {
    field: "userName",
    headerName: "User",
    width: 170,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <Avatar sx={{ bgcolor: 'dodgerblue' }}>{params.row.userName.substring(0, 1).toUpperCase()}</Avatar> &nbsp;&nbsp;
          {/* <img className="cellImg" src={params.row.img} alt="avatar" /> */}
          {params.row.userName}
        </div>
      );
    },
  },
  {
    field: "originAddress",
    headerName: "From",
    width: 230,
  },
  {
    field: "destinationAddress",
    headerName: "To",
    width: 230,
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];
export const tripHeader = [
  
  { field: "uid", headerName: "ID", width: 280,hide:true },
  { field: "userId", headerName: "USER ID", width: 280,hide:true },
  { field: "driverId", headerName: "USER ID", width: 280,hide:true },
  { field: "time", headerName: "Date", width: 180,valueFormatter: params => 
  moment(params?.value).format("Do MMM YYYY, h:mm A"), },
  // {
  //   field: "driverName",
  //   headerName: "Driver",
  //   width: 170,
  //   renderCell: (params) => {
  //     return (
  //       <div className="cellWithImg">
  //         <Avatar sx={{ bgcolor: 'dodgerblue' }}>{params.row.driverName.substring(0, 1).toUpperCase()}</Avatar> &nbsp;&nbsp;
  //         {params.row.driverName}
  //       </div>
  //     );
  //   },
  // },
  {
    field: "userName",
    headerName: "User",
    width: 170,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <Avatar sx={{ bgcolor: 'dodgerblue' }}>{params.row.userName.substring(0, 1).toUpperCase()}</Avatar> &nbsp;&nbsp;
          {params.row.userName}
        </div>
      );
    },
  },
  {
    field: "originAddress",
    headerName: "From",
    width: 230,
  },
  {
    field: "destinationAddress",
    headerName: "To",
    width: 230,
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    renderCell: (params) => {
      return (
        params.row.status === 'ended' ? <div className={`cellWithStatus`} style={{fontWeight:'bolder',background:'#C1D8C2',color:'#668D27'}}>
          {params.row.status.toUpperCase()}
        </div> : params.row.status === 'Canceled' ? 
          <div className={`cellWithStatus`} style={{fontWeight:'bolder',background:'#F2C1C1',color:'#D53B3B'}}>
            {params.row.status.toUpperCase()}
          </div> :params.row.status === 'pending' ? 
          <div className={`cellWithStatus`} style={{fontWeight:'bolder',background:'#FBFBBD',color:'#F2A503'}}>
            {params.row.status.toUpperCase()}
          </div>:
          <div className={`cellWithStatus`} style={{fontWeight:'bolder',background:'#899CC7',color:'#344772'}}>
            {params.row.status.toUpperCase()}
          </div>
      );
    },
  },
];


//temporary data
export var userRows = [
  {
    id: 1,
    username: "Snow",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    status: "active",
    email: "1snow@gmail.com",
    age: 35,
  },
  {
    id: 2,
    username: "Jamie Lannister",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "2snow@gmail.com",
    status: "passive",
    age: 42,
  },
  {
    id: 3,
    username: "Lannister",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "3snow@gmail.com",
    status: "pending",
    age: 45,
  },
  {
    id: 4,
    username: "Stark",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "4snow@gmail.com",
    status: "active",
    age: 16,
  },
  {
    id: 5,
    username: "Targaryen",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "5snow@gmail.com",
    status: "passive",
    age: 22,
  },
  {
    id: 6,
    username: "Melisandre",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "6snow@gmail.com",
    status: "active",
    age: 15,
  },
  {
    id: 7,
    username: "Clifford",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "7snow@gmail.com",
    status: "passive",
    age: 44,
  },
  {
    id: 8,
    username: "Frances",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "8snow@gmail.com",
    status: "active",
    age: 36,
  },
  {
    id: 9,
    username: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "snow@gmail.com",
    status: "pending",
    age: 65,
  },
];

