import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns} from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState } from "react";
import {ref, onValue} from 'firebase/database'
import {db,} from "../../services/firebase.js"
import { useEffect } from "react";

const Datatable = () => {
  
  const [data, setData] = useState([]);


  useEffect(() => {
    const userRef = ref(db,'users');
    onValue(userRef, (snapshot) =>{
      setData([]);
      const dataCheck = snapshot.val();
      if(dataCheck !== null){
        Object.values(dataCheck).map((dat) => {
          setData((oldArray) =>[...oldArray,dat])
        });
      }
      // snapshot.forEach(childSnap =>{
      //   let keyName = childSnap.key;
      //   let dataValue = childSnap.val();
      //   userRow.push({"key" : keyName,"data":dataValue})
      // })
      // setData(userRow);
    }
    );
  },[])
  

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/profile" state={{ uid :params.row.uid }} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Users List
        {/* <Link to="/users/new" className="link">
          Add New
        </Link> */}
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
