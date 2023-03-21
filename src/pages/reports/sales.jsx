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
import moment from 'moment';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const Sales = () => {
    const [emptyData, setEmptyData] = useState(false);
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
                                    setEmptyData(false)
                                }
                            }else{
                                if( startDate <= endTripTime && endDate >= endTripTime){
                                    total = total + earn.end_trip.fare_amount;
                                    setEarnings((oldArray) =>[...oldArray,earn])
                                    setEmptyData(false)
                                }
                            }
                        })
                        trip.pop()
                    }else{
                        setEmptyData(true)
                    }
                });
                setTotalEarnings(total)
            }
            // console.log("earnings-------------------")
            // console.log(earnings)
            // console.log("total earnings-------------------")
            // console.log(totalEarnings)
        })
    }
    return (
        <div className='reports'>
            <Sidebar />
            <div className="reportContainer">
                <Navbar />
                <div className="reportTitle">
                    <h3>List of Fare</h3>
                </div>
                <div className="top">
                    <div className="left">
                        <DateRangePicker
                            editableDateInputs={false}
                            onChange={item => setState([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={state}
                        />
                        <br /><br />
                        <Button variant="outlined" color="success" onClick={()=>{searchData(state)}}>View Sales Report</Button>
                    </div>
                </div>
                <div className="bottom">
                    {totalEarnings === 0 ? 
                        <Button variant="outlined" color="success" disabled >Export excel</Button>
                        :
                        <DownloadTableExcel
                        filename="sales table"
                        sheet="sales"
                        currentTableRef={tableRef.current}
                        >
                        
                        <Button variant="outlined" color="success" >Export excel</Button>
                    </DownloadTableExcel> 
                    }
                    <br /> <br />
                    
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" ref={tableRef}>
                        <TableHead>
                            <TableRow>
                            <TableCell><strong>Transaction ID</strong></TableCell>
                            <TableCell align="center"><strong>Date</strong></TableCell>
                            <TableCell align="center"><strong>Amount</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                totalEarnings === 0 ? 
                                <>
                                    <TableRow
                                    key={"total"}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell colSpan={3} align="center">
                                        <i><strong>No Data Found</strong></i>
                                        </TableCell>
                                    </TableRow>
                                </> :
                                earnings.map((earn) => (
                                    <TableRow
                                        key={earn.uid}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" >
                                        {earn.uid}
                                        </TableCell>
                                        <TableCell align="center">
                                            {moment(earn.end_trip.end_trip_time).format("MM/DD/YYYY")}
                                        </TableCell>
                                        <TableCell align="center">
                                        {parseFloat(earn.end_trip.fare_amount).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                            {
                                totalEarnings === 0 ? <></> :
                                    <TableRow
                                    key={"total"}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="right">
                                    </TableCell>
                                    <TableCell align="center">
                                        <strong>TOTAL</strong>
                                    </TableCell>
                                    <TableCell align="center">
                                    <strong>{totalEarnings}</strong>
                                    </TableCell>
                                </TableRow>
                            }
                            
                        </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}

export default Sales;