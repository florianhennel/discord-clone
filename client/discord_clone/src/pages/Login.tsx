import InputField from "../components/InputField";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useSocket } from "./SocketContext";

function Login() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [status,setStatus] = useState(0);
    const emailFromChild = (data: string) => {
        setEmail(data);
      };
      const passwordFromChild = (data: string) => {
        setPassword(data);
      };
      const navigate = useNavigate();
      const socket = useSocket();
    return (
        <div className='flex flex-col justify-center items-center h-full bg-slate-900 bg-futurisic-green bg-cover' >
        <form action="" className="text-center flex flex-col items-center gap-8 rounded-lg backdrop-blur-lg px-5 py-16 ring-4 ring-emerald-700">
            <div className="text-neutral-200 text-4xl font-bold uppercase">Login</div>
            <InputField onData={emailFromChild} type="email" name="LoginEmail" id="email" label="Email" status={status} />
            <InputField onData={passwordFromChild} type="password" name="LoginPassword" id="passw" label="Password" status={status} />
            <button className="rounded-sm w-24 h-10 bg-gradient-to-r from-teal-700 to-emerald-600 text-white text-base font-semibold" onClick={async(e)=>{
                e.preventDefault();
                try{
                  
                const response = await fetch("https://jh4pgfv0-3000.euw.devtunnels.ms/login",{
                    method:"POST",
                    headers: {
                        'Content-Type': 'application/json'
                      },
                    body:JSON.stringify({
                        email:email,
                        password:password,
                    })
                    
                });
                const json = await response.json();
                const st = await response.status;
                setStatus(st);
                if (st === 200) {
                  localStorage.setItem("token",json.token);
                  socket?.connect();
                  navigate('/home');
                }
                
              }
              catch(error){
                console.log(error);
              }
            }
                
            }>Log In</button>
            
        </form>
        <a href="./signup" className="text-white text-sm hover:underline">Sign up</a>
        </div>
    )
  }
  
  export default Login