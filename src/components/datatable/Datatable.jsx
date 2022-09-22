import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns,userRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState } from "react";
import {ref, onValue} from 'firebase/database'
import {db} from "../../services/firebase.js"

const Datatable = () => {
  

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  var userRowsDB =[];
  var userRow =[];
  const userRef = ref(db,'users');
  onValue(userRef, (snapshot) =>{
    userRowsDB = snapshot.val();

    //to get specific row of data
    // snapshot.forEach((childSnapshot) => {
    //   const childKey = childSnapshot.key;
    //   userRowsDB = childSnapshot.val();  
    // });
  }
  );
  Object.entries(userRowsDB).forEach(([key,val])=>{
    userRow.push(val);
  })
  
  console.log(userRow);
  console.log(userRows);

  const [data, setData] = useState(userRow);
  // const [data, setData] = useState(userRowsDB);

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/test" style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New User
        <Link to="/users/new" className="link">
          Add New
        </Link>
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
