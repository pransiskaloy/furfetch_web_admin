import "./login.scss"
import { useState } from "react"
import {auth} from "../../services/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [error, setError] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate(); // use this to go to other page

  const handleLogin = (e)=>{
    e.preventDefault()
    
    signInWithEmailAndPassword(auth, email,password)
    .then((userCredential) =>{
      //Signed in
      const user = userCredential.user;
      // console.log(user)
      navigate("/") // use this to go to home
    })
    .catch((error) => {
      console.log(error.message);
      setError(true)
    })
  }


  return (
    <div className="login">
      <form onSubmit={handleLogin}>
        <h1 className="ehatid-title">ehatid</h1>
        <input type="email" placeholder="Email" onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} /> <br />
        <button type="submit">Login</button>
        {error && <span>Wrong Email or Password</span>}
        <br /><br />
        <span className="copyright"> © Copyright. All Rights Reserve 2022</span>
      </form>
    </div>
  )
}

export default Login