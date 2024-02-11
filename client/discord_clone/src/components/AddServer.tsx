import InputField from "./InputField"
import { useState,MouseEventHandler, useEffect } from "react";

interface Props{
    activate:any,
    addServer:any,
    userName:string,
}

function AddServer({activate,addServer,userName}:Props){
    const [status,setStatus] = useState(0);
    const [code,setCode] = useState("");
    const [mouseOnX,setMouseOnX] = useState(false);
    const [name,setName] = useState("");
    const codeFromChild = (code :string)=>{
        setCode(code);
    }
    const nameFromChild = (nam :string)=>{
        setName(nam);
    }
    const mouseOn = ()=>{
        setMouseOnX(true);
    }
    const mouseOff = ()=>{
        setMouseOnX(false);
    }
    const handleActivate:MouseEventHandler<HTMLAnchorElement>= ()=>{
        activate();
    }
    useEffect(()=>{
        setName(`${userName}'s server`);
    },[userName])
    return (
        <div className=" bg-stone-800 flex flex-col items-center justify-center text-center text-neutral-300 gap-10 p-10 rounded-xl">
            <div className=" flex flex-col text-center items-center gap-5 p-10">
                <a onClick={handleActivate} className={"absolute top-0 right-3 text-3xl cursor-pointer "+(mouseOnX?"text-red-600":"text-neutral-300")} onMouseEnter={mouseOn} onMouseLeave={mouseOff} >x</a>     
                <div className="text-neutral-200 text-4xl font-bold uppercase">Join a server!</div>
                <div>
                    Put your invitation code here!
                </div>
                <InputField onData={codeFromChild} type="text" name="invite" id="serverInvite" label="Invitation code" status={status} />
                <button onClick={async (e)=>{
                    e.preventDefault();
                    const token = localStorage.getItem("token");
                    if (token) {
                        try{      
                            const response = await fetch("http://localhost:3000/home/addserver",{
                                method:"POST",
                                headers:{
                                    "authorization":token,
                                    'Content-Type': 'application/json',
                                },
                                body:JSON.stringify({
                                    inv:code,
                                })
                            })
                            const st = await response.status;
                            const json = await response.json();
                            setStatus(st);
                            console.log(json);
                            if (st===241) {
                                activate();
                                addServer(json.server);
                            }
                        
                        }
                        catch (error){
                        console.error(error); 
                        }
                    }
                    
                }} className="rounded-sm p-2 bg-gradient-to-r from-teal-700 to-emerald-600 text-white text-base font-semibold">Join Server</button>
            </div>
            <div className=" flex flex-col text-center items-center gap-5 p">
            <div className="text-neutral-200 text-4xl font-bold uppercase">Create a server!</div>
            <div>
                Whats the name of the sever gonna be!
            </div>
            <InputField defaultName={name} onData={nameFromChild} type="text" name="create" id="serverCreate" label="Server name" status={status} />
            </div>
            <button onClick={async (e)=>{
                e.preventDefault();
                const token = localStorage.getItem("token");
                if (token) {
                    try{      
                        const response = await fetch("https://d1xppr12-3000.euw.devtunnels.ms/createserver",{
                            method:"POST",
                            headers:{
                                "authorization":token,
                                'Content-Type': 'application/json',
                            },
                            body:JSON.stringify({
                                name:name,
                            })
                        })
                        const st = await response.status;
                        const json = await response.json();
                        setStatus(st);
                        console.log(json);
                        if (st===241) {
                            activate();
                            addServer(json.server);
                        }
                        
                    }
                    catch (error){
                      console.error(error); 
                    }
                }
                    
            }} className="rounded-sm p-2 bg-gradient-to-r from-teal-700 to-emerald-600 text-white text-base font-semibold">Create Server</button>
        </div>
    )
}

export default AddServer