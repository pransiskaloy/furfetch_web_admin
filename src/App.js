import Home from "./pages/home/Home";
import Earnings from "./pages/home/Earnings";
import Login from "./pages/login/Login";
import ListDriver from "./pages/list/ListDriver";
import ListTrip from "./pages/list/ListTrip";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import SingleTrip from "./pages/single/SingleTrip";
import SingleDriver from "./pages/single/SingleDriver";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext ,useState} from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { auth} from "./services/firebase"
import {onAuthStateChanged} from "firebase/auth"
import SingleTripUser from "./pages/single/SingleTripUser";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const [user, setUser] = useState({});

  onAuthStateChanged(auth,(currentUser) =>{
      setUser(currentUser);
    })
  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
              {user ? 
            <>
              <Route index element={<Home />} />
              <Route path="/earnings">
                <Route index element={<Earnings />} />
              </Route>
              <Route path="/users">
                <Route index element={<List />} />
                <Route path=":userId" element={<Single />} />
                <Route
                  path="trip-details"
                  element={<SingleTripUser title="Add New Product" />}
                  // element={<New inputs={productInputs} title="Add New Product" />}
                />
                <Route
                  path="new"
                  element={<New inputs={userInputs} title="Add New User" />}
                />
                <Route
                  path="trip"
                  element={<New inputs={userInputs} title="Trip Information" />}
                />
              </Route>
              <Route path="/drivers">
                <Route index element={<ListDriver />} />
                <Route path=":driverId" element={<SingleDriver />} />
                <Route
                  path="new"
                  element={<New inputs={userInputs} title="Add New User" />}
                />
                <Route
                  path="trip"
                  element={<New inputs={userInputs} title="Trip Information" />}
                />
              </Route>
              <Route path="/trips">
                <Route index element={<ListTrip />} />
                <Route path=":productId" element={<Single />} />
                <Route
                  path="trip-details"
                  element={<SingleTrip title="Add New Product" />}
                  // element={<New inputs={productInputs} title="Add New Product" />}
                />
              </Route>
            </> :
            <>
              <Route index element={<Login />} />
            </>  
            }
          </Route>
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
