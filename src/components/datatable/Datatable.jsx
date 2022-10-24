import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns} from "../../datatablesource";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Link } from "react-router-dom";
import { useState } from "react";
import {ref, onValue} from 'firebase/database'
import {db,} from "../../services/firebase.js"
import { useEffect } from "react";

const Datatable = () => {
  
  const [data, setData] = useState([]);
  const [countUser, setCountUser] = useState(0);


  useEffect(() => {
    const userRef = ref(db,'users');
    onValue(userRef, (snapshot) =>{
      let counter = 0;
      setCountUser(0);
      setData([]);
      const dataCheck = snapshot.val();
      if(dataCheck !== null){
        Object.values(dataCheck).map((dat) => {
          setData((oldArray) =>[...oldArray,dat])
          counter++
        });
      }
      setCountUser(counter)
      // snapshot.forEach(childSnap =>{
      //   let keyName = childSnap.key;
      //   let dataValue = childSnap.val();
      //   userRow.push({"key" : keyName,"data":dataValue})
      // })
      // setData(userRow);
    }
    );
  },[])

  //temporary percentage
  const diff=20;
  const widgetData = {
    title: "TOTAL USER",
    isMoney: false,
    link: <>
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
  
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/profile" state={{ userData :params.row }} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
        Users List
        {/* <Link to="/users/new" className="link">
          Add New
        </Link> */}
      <div className="datatableTitle">
        <div className="widgets">
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
        </div>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        getRowId = {(row) => row.uid}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};

export default Datatable;
