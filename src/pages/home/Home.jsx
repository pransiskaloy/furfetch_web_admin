import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import {useState,useEffect} from 'react';
import { getDatabase, ref, get, child ,onValue} from "firebase/database";
import {db,} from "../../services/firebase.js"
import { addDays, format } from 'date-fns';
import moment from 'moment';
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Home = () => {
  const [totalEarnings,setTotalEarnings] = useState(0)
  const [totalEarningsMonthly,setTotalEarningsMonthly] = useState(0)
  const [percentage,setPercentage] = useState('')
  const earningRef = ref(db,'All Ride Request');
  const [weekly,setWeekly] =useState([])

  var startOfWeek = moment().startOf('week').toDate();
  var endOfWeek   = moment().endOf('week').toDate();

  console.log(moment().format('MMMM Do YYYY, h:mm:ss a'))
  console.log(format(new Date(moment().format()), 'yyyy-MM-dd'))
  console.log(moment(endOfWeek).format('dddd'))
  const [weekState,setWeekState] = useState([
    {
      startDate: startOfWeek,
      endDate: endOfWeek,
      key: 'selection'
  }
  ])
  const [state, setState] = useState([
      {
          startDate: new Date(),
          endDate: addDays(new Date(), 0),
          key: 'selection'
      }
  ]);
  
  useEffect(()=>{ 
    searchData(state)
    searchData(weekState)
  },[]) 

  const searchData =(dateValue) =>{
      let total = 0.0
      let totalMonthly = 0.0
      let trip = []
      let sunTot = 0
      let monTot = 0
      let tueTot = 0
      let wedTot = 0
      let thurTot = 0
      let friTot = 0
      let satTot = 0
      onValue(earningRef, (snapshot) =>{
          let startDate ='' 
          let endDate =''
          let endTripTime = ''
          dateValue.map((data) =>{
              startDate = format(new Date(data.startDate), 'yyyy-MM-dd')
              endDate = format(new Date(data.endDate), 'yyyy-MM-dd')
          })
          
          setTotalEarnings(0)
          const dataCheck = snapshot.val();
          if(dataCheck !== null){
            Object.values(dataCheck).map((dat) => {
              if(dat.end_trip){
                trip.push(dat.end_trip)
                trip.map((earn) => {
                    totalMonthly = totalMonthly + earn.fare_amount;
                    endTripTime = format(new Date(earn.end_trip_time), 'yyyy-MM-dd')

                    if(startDate === endDate){
                        if(startDate === endTripTime){
                            total = total + earn.fare_amount;
                        }
                    }
                    else{
                      switch(moment(earn.end_trip_time).format('dddd')){
                        case 'Saturday':
                          satTot = satTot + earn.fare_amount;break;
                        case 'Sunday':
                          sunTot = sunTot + earn.fare_amount;break;
                        case 'Monday':
                          monTot = monTot + earn.fare_amount;break;
                        case 'Tuesday':
                          tueTot = tueTot + earn.fare_amount;break;
                        case 'Thursday':
                          thurTot = thurTot + earn.fare_amount;break;
                        case 'Friday':
                          friTot = friTot + earn.fare_amount;break;
                        default: setWeekly();
                      }
                    }
                })
                trip.pop()
              }
            });
            setWeekly([
              {name:'Sunday',Total:sunTot},
              {name:'Monday',Total:monTot},
              {name:'Tuesday',Total:tueTot},
              {name:'Wednesday',Total:wedTot},
              {name:'Thursday',Total:thurTot},
              {name:'Friday',Total:friTot},
              {name:'Saturday',Total:satTot},
            ])
            setPercentage( Number((total / totalMonthly) * 100).toFixed(2) )
            setTotalEarnings(total)
            setTotalEarningsMonthly(totalMonthly)
          }
      })
  }

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="driver" />
          <Widget type="earning" />
          <Widget type="trip" />
        </div>
        <div className="charts">
          <div className="featured">
            <div className="top">
              <h1 className="title">Total Monthly Earning</h1>
              <MoreVertIcon fontSize="small" />
            </div>
              <p className="amount" style={{textAlign:'center'}}>Php {totalEarningsMonthly}</p>
            <div className="bottom">
              <div className="featuredChart">
                <CircularProgressbar value={percentage} text={percentage + '%'} strokeWidth={5} />
              </div>
              <p className="title">Total earnings made today</p>
              <p className="amount">Php {totalEarnings}</p>
              <p className="desc">
                Previous transactions processing. Last payments may not be included.
              </p>
            </div>
          </div>
          <div className="chart">
            <div className="title">Weekly Earnings</div>
            <ResponsiveContainer width="100%" aspect={2/1}>
              <AreaChart
                width={730}
                height={250}
                data={weekly}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="gray" />
                <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="Total"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#total)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <Table />
        </div> */}
      </div>
    </div>
  );
};

export default Home;
