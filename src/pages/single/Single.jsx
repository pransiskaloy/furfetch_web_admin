import "./single.scss";
import { useEffect,useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import { useLocation } from 'react-router-dom'
import {ref, onValue} from 'firebase/database'
import {db,} from "../../services/firebase.js"
import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid";

const Single = () => {
  const location = useLocation()
  const { uid } = location.state
  const [data, setData] = useState([]);
  const [info, setInfo] = useState([]);

  useEffect(() => {
    const userRef = ref(db,'users/'+uid);
    onValue(userRef, (snapshot) =>{
      setData([]);
      const dataCheck = snapshot.val();
      setInfo(dataCheck);
      if(dataCheck !== null){
        Object.values(dataCheck).map((dat) => {
          setData((oldArray) =>[...oldArray,dat])
        });
      }
    }
    );
  },[])
  
  console.log(info);
  
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
              <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
          </div>
          <div className="right">
              <List/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
