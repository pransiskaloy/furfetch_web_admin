import "./home.scss";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import {useState,useEffect} from 'react';
import { addDays, format } from 'date-fns';
import 'react-date-range/dist/styles.css'; 
import Button from '@mui/material/Button';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import { getDatabase, ref, get, child ,onValue} from "firebase/database";
import {db,} from "../../services/firebase.js"
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { AreaChart, Area, XAxis, CartesianGrid,Tooltip,ResponsiveContainer} from "recharts";

  
const Earnings = () => {
    const [earnings,setEarnings] = useState([])
    const [totalEarningsMonthly,setTotalEarningsMonthly] = useState(0)
    const [totalEarnings,setTotalEarnings] = useState(0)
    const earningRef = ref(db,'All Ride Request');
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 0),
            key: 'selection'
        }
    ]);

    useEffect(()=>{ 
        searchData(state)
    },[]) 

    const searchData =(dateValue) =>{
        let total = 0.0
        let totalMonthly = 0.0
        let trip = []
        onValue(earningRef, (snapshot) =>{
            let startDate ='' 
            let endDate =''
            let endTripTime = ''
            dateValue.map((data) =>{
                startDate = format(new Date(data.startDate), 'yyyy-MM-dd')
                endDate = format(new Date(data.endDate), 'yyyy-MM-dd')
            })
            
            setEarnings([])
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
                                    setEarnings((oldArray) =>[...oldArray,earn])
                                }
                            }else{
                                if( startDate <= endTripTime && endDate >= endTripTime){
                                    total = total + earn.fare_amount;
                                    setEarnings((oldArray) =>[...oldArray,earn])
                                }
                            }
                        })
                        trip.pop()
                    }
                });
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
                <div className="top">
                    <div className="left">
                        <DateRangePicker
                            editableDateInputs={false}
                            onChange={item => setState([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={state}
                        />
                        <Button variant="outlined" onClick={()=>{searchData(state)}}>View Total Earnings</Button>
                    </div>
                    <div className="right">
                        <div className="featured">
                            <div className="top">
                                <h1 className="title">Total Revenue</h1>
                                <MoreVertIcon fontSize="small" />
                            </div>
                            <div className="bottom">
                                <div className="featuredChart">
                                <CircularProgressbar value={totalEarningsMonthly} text={totalEarningsMonthly} strokeWidth={5} />
                                </div>
                                <p className="title">Total earnings made today</p>
                                <p className="amount">Php {totalEarnings}</p>
                                <p className="desc">
                                Previous transactions processing. Last payments may not be included.
                                </p>
                                <div className="summary">
                                <div className="item">
                                    <div className="itemTitle">Target</div>
                                    <div className="itemResult negative">
                                    <KeyboardArrowDownIcon fontSize="small"/>
                                    <div className="resultAmount">$12.4k</div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="itemTitle">Last Week</div>
                                    <div className="itemResult positive">
                                    <KeyboardArrowUpOutlinedIcon fontSize="small"/>
                                    <div className="resultAmount">$12.4k</div>
                                    </div>
                                </div>
                                <div className="item">
                                    <div className="itemTitle">Last Month</div>
                                    <div className="itemResult positive">
                                    <KeyboardArrowUpOutlinedIcon fontSize="small"/>
                                    <div className="resultAmount">$12.4k</div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="chart">
                        <ResponsiveContainer width="100%" aspect={2/1}>
                            <AreaChart
                            width={530}
                            height={250}
                            data={earnings}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                            <defs>
                                <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="end_trip_time" stroke="gray" />
                            <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
                            <Tooltip />
                            {console.log(earnings)}
                            <Area
                                type="monotone"
                                dataKey="fare_amount"
                                stroke="#8884d8"
                                fillOpacity={1}
                                fill="url(#total)"
                            />
                            </AreaChart>
                        </ResponsiveContainer>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default Earnings;