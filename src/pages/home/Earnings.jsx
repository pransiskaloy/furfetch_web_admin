import "./home.scss";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Featured from "../../components/featured/Featured";
import {useState,useEffect} from 'react';
import { addDays, format } from 'date-fns';
import 'react-date-range/dist/styles.css'; 
import Button from '@mui/material/Button';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import { getDatabase, ref, query, orderByChild } from "firebase/database";


const Earnings = () => {
    const db = getDatabase();
    const [state, setState] = useState([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 0),
          key: 'selection'
        }
      ]);
    //   const [counters, setCounter] = useState(0);
    
    const searchData =(dateValue) =>{
        dateValue.map((data) =>{
            var startDate = format(new Date(data.startDate), 'yyyy-MM-dd')
            var endDate = format(new Date(data.endDate), 'yyyy-MM-dd')
            const earningsData = query(ref(db, 'All Ride Request'), orderByChild('end_trip/end_trip_time'),);
        })
    }

    useEffect(()=>{
        //searchData      
        searchData(state)
    })
    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="top">
                    <div className="left">
                        <DateRangePicker
                            // onChange={item => {                                
                            //     setState([item.selection])
                            //     setCounter(prev => prev + 1);
                            //     if (counters == 1) {
                                    // props.loadPaymentHistoryFromTo(user.school_id, convertStringDateToTimstamp(item.selection.startDate), convertStringDateToTimstamp(item.selection.endDate))
                                    // setCounter(0);
                            //     }
                            // }}
                            // showSelectionPreview={true}
                            // moveRangeOnFirstSelection={false}
                            // months={2}
                            // ranges={state}
                            // direction="horizontal"
                            editableDateInputs={false}
                            onChange={item => setState([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={state}
                        />
                        <Button variant="outlined" onClick={()=>{searchData(state)}}>View Transaction</Button>
                    </div>
                    <div className="right">
                        <Featured />
                    </div>
                </div>
                <div className="bottom">

                </div>
            </div>
        </div>
    );
};

export default Earnings;