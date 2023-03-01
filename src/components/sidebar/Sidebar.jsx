import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CardTravelIcon from "@mui/icons-material/CardTravel";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import {auth } from "../../services/firebase"
import {signOut} from "firebase/auth"
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import CommuteIcon from '@mui/icons-material/Commute';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);

  const logOut = () =>{
    signOut(auth);
  }
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Ehatid Admin</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          <Link to="/earnings" style={{ textDecoration: "none" }}>
            <li>
              <InsertChartIcon className="icon" />
              <span>Earnings</span>
            </li>
          </Link>
          <p className="title">PROFILE</p>
          <Link to="/profile"  style={{ textDecoration: "none" }}>
            <li>
              <AccountCircleOutlinedIcon className="icon" />
              <span>My Account</span>
            </li>
          </Link>
          <Link to="/staff/register" style={{ textDecoration: "none" }}>
            <li>
              <SupervisorAccountIcon className="icon" />
              <span>Staff</span>
            </li>
          </Link>
          <p className="title">LISTS</p>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>App Users</span>
            </li>
          </Link>
          <Link to="/drivers" style={{ textDecoration: "none" }}>
            <li>
              <DriveEtaIcon className="icon" />
              <span>Drivers</span>
            </li>
          </Link>
          <Link to="/trips" style={{ textDecoration: "none" }}>
            <li>
              <CardTravelIcon className="icon" />
              <span>Trips</span>
            </li>
          </Link>
          {/* <li>
            <CreditCardIcon className="icon" />
            <span>Orders</span>
          </li>
          <li>
            <LocalShippingIcon className="icon" />
            <span>Delivery</span>
          </li>
          <p className="title">USEFUL</p>
          <li>
            <NotificationsNoneIcon className="icon" />
            <span>Notifications</span>
          </li>
          <p className="title">SERVICE</p>
          <li>
            <SettingsSystemDaydreamOutlinedIcon className="icon" />
            <span>System Health</span>
          </li>
          <li>
            <PsychologyOutlinedIcon className="icon" />
            <span>Logs</span>
          </li>
          <li>
            <SettingsApplicationsIcon className="icon" />
            <span>Settings</span>
          </li> */}
          
          <p className="title">REPORTS</p>
          <li>
            <AssessmentIcon className="icon" />
            <span>Sales</span>
          </li>
          <li>
            <ContactPageIcon className="icon" />
            <span>App Users</span>
          </li>
          <li>
            <CommuteIcon className="icon" />
            <span>Drivers</span>
          </li>
          <li>
            <AnnouncementIcon className="icon" />
            <span>Complaints</span>
          </li>
          <p className="title">SETTINGS</p>
          <Link to="/fare" style={{ textDecoration: "none" }}>
            <li>
              <AttachMoneyIcon className="icon" />
              <span>Fare</span>
            </li>
          </Link>
          <Link to="/trips" style={{ textDecoration: "none" }}>
            <li>
              <SubscriptionsIcon className="icon" />
              <span>Subscription</span>
            </li>
          </Link><br /> <hr /> <br />
          <Link to="/" style={{ textDecoration: "none" }}>
            <li onClick={logOut}>
              <ExitToAppIcon className="icon" />
              <span>Logout</span>
            </li>
          </Link>
        </ul>
      </div>
      {/* <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div> */}
    </div>
  );
};

export default Sidebar;
