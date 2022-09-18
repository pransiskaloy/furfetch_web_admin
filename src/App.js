import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext ,useState} from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { auth} from "./services/firebase"
import {onAuthStateChanged} from "firebase/auth"

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
              <Route path="/users">
                <Route index element={<List />} />
                <Route path=":userId" element={<Single />} />
                <Route
                  path="new"
                  element={<New inputs={userInputs} title="Add New User" />}
                />
              </Route>
              <Route path="/">
                <Route index element={<List />} />
                <Route path=":productId" element={<Single />} />
                <Route
                  path="new"
                  element={<New inputs={productInputs} title="Add New Product" />}
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
