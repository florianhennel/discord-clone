import { useState } from "react";
import InputField from "../components/InputField";
import { useNavigate } from "react-router-dom";

function Signup(){
    const [email,setEmail] = useState("");
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [status,setStatus] = useState(0);
    const navigate = useNavigate();
    const emailFromChild = (data: string) => {
        setEmail(data);
      };
      const usernameFromChild = (data: string) => {
        setUsername(data);
      };
      const passwordFromChild = (data: string) => {
        setPassword(data);
      };
      
    return(
        <div className='flex flex-col justify-center items-center h-full bg-futurisic-green bg-cover' >
        <form className="text-center flex flex-col items-center gap-8 rounded-lg backdrop-blur-lg px-5 py-16 ring-4 ring-emerald-700">
            <div className="text-neutral-200 text-4xl font-bold uppercase">Sign Up</div>
            <InputField onData={emailFromChild} type="email" name="SignUpEmail" id="email" label="Email" status={status} />
            <InputField onData={usernameFromChild} type="text" name="username" id="username" label="Username" status={status} />
            <InputField onData={passwordFromChild} type="password" name="SignUpPassword" id="passw" label="Password" status={status} />
            
            <button type="submit" className="rounded-sm w-24 h-10 bg-gradient-to-r from-teal-700 to-emerald-600 text-white text-base font-semibold" onClick={async (e)=>{
                e.preventDefault();
                try{
                  const response = await fetch("https://jh4pgfv0-3000.euw.devtunnels.ms/signup",{
                    method:"POST",
                    headers: {
                        'Content-Type': 'application/json'
                      },
                    body:JSON.stringify({
                        email:email,
                        username:username,
                        password:password
                    })
                    
                }) 
                const st = await response.status;
                setStatus(st);
                console.log(st);
                if (st === 210) {
                  navigate('/login');
                }
              }
              catch (error){
                console.error(error);
                
              }
            }
                
            }>Sign Up</button>
        </form>
        <a href="./login" className="text-white text-sm hover:underline">Log In</a>

        </div>
    )
}

export default Signup