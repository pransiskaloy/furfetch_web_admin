import "./reports.scss";
import { DateRangePicker } from 'react-date-range';
import Sidebar from "../../components/sidebar/Sidebar";
import React from 'react'
import Navbar from "../../components/navbar/Navbar";
import {useState,useEffect,useRef} from 'react';
import { addDays, format } from 'date-fns';
import Button from '@mui/material/Button';
import {db,} from "../../services/firebase.js"
import { getDatabase, ref, get, child ,onValue} from "firebase/database";
import { DownloadTableExcel } from 'react-export-table-to-excel';

const Sales = () => {
    const tableRef = useRef(null);
    const [earnings,setEarnings] = useState([])
    const [totalEarnings,setTotalEarnings] = useState(0)
    const earningRef = ref(db,'All Ride Request');
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 1),
            key: 'selection'
        }
    ]);

    useEffect(()=>{ 
        searchData(state)
    },[]) 

    const searchData = (dateValue) =>{
        let total = 0.0
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
                        // console.log(dat)


                        trip.push(dat)
                        // trip.push(dat.end_trip)
                        trip.map((earn) => {
                            endTripTime = format(new Date(earn.end_trip.end_trip_time), 'yyyy-MM-dd')

                            // total = total + earn.end_trip.fare_amount;
                            // setEarnings((oldArray) =>[...oldArray,earn])


                            if(startDate === endDate){
                                if(startDate === endTripTime){
                                    total = total + earn.end_trip.fare_amount;
                                    setEarnings((oldArray) =>[...oldArray,earn])
                                }
                            }else{
                                if( startDate <= endTripTime && endDate >= endTripTime){
                                    total = total + earn.end_trip.fare_amount;
                                    setEarnings((oldArray) =>[...oldArray,earn])
                                }
                            }
                        })
                        trip.pop()
                    }
                });
                setTotalEarnings(total)
            }
            // console.log("earnings-------------------")
            console.log(earnings)
            // console.log("total earnings-------------------")
            console.log(totalEarnings)
        })
    }
    return (
        <div className='reports'>
            <Sidebar />
            <div className="reportContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        <DateRangePicker
                            editableDateInputs={false}
                            onChange={item => setState([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={state}
                        />
                        <br /><br />
                        <Button variant="outlined" color="success" onClick={()=>{searchData(state)}}>View Report</Button>
                    </div>
                    <div className="right">
                        <DownloadTableExcel
                        filename="users table"
                        sheet="users"
                        currentTableRef={tableRef.current}
                        >

                            <button> Export excel </button>

                        </DownloadTableExcel>
                        <table ref={tableRef}>
                            <tbody>
                                <tr>
                                    <th>Transaction ID</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                </tr>
                                <tr>
                                    <td>Edison</td>
                                    <td>Padilla</td>
                                    <td>20</td>
                                </tr>
                                <tr>
                                    <td>Alberto</td>
                                    <td>Lopez</td>
                                    <td>94</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sales;