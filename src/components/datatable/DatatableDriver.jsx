import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { driverColumns} from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import {ref, onValue} from 'firebase/database'
import {db,} from "../../services/firebase.js"

const DatatableDriver = () => {
  
  const [data, setData] = useState([]);

  // const handleDelete = (id) => {
  //   setData(data.filter((item) => item.id !== id));
  // };

  useEffect(() => {
    const userRef = ref(db,'drivers');
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
            <Link to="/drivers/profile" state={{ uid :params.row.id }} style={{ textDecoration: "none" }}>
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
      <div className="datatableTitle">
        Drivers List
        {/* <Link to="/users/new" className="link">
          Add New
        </Link> */}
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
