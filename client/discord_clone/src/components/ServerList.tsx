import ServerIcon from "./ServerIcon"
import AddServer from "./AddServer"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSocket } from "../pages/SocketContext"

interface Props{
    serverList:any[],
    username:string,
}

function ServerList({serverList,username}:Props){
    const navigate = useNavigate();
    const [opened,setOpened] = useState(false);
    const [servers,setServers] = useState<any[]>([]);
    const [user,setUser] = useState<string>("");
    const socket = useSocket();
    useEffect(()=>{
        setServers(serverList);
        setUser(username);
    },[serverList,username])
    const open = () => {
        setOpened(true);
      };
      const close = ()=>{
        setOpened(false);
      }
      const logout = async ()=>{
            const token = localStorage.getItem("token");
                if (token) {
                    try{      
                        await fetch("https://d1xppr12-3000.euw.devtunnels.ms/logout/",{
                            method:"POST",
                            headers:{
                                "authorization":token,
                                'Content-Type': 'application/json',
                            },
                        });
                        
                    }
                    catch (error){
                      console.error(error); 
                    }
                    
                }
                socket && socket.disconnect();
                localStorage.removeItem('token');
                navigate('../login');
            
      }
      const addServer = (newServer:any)=>{
        setServers([...servers,newServer])
      }
    return (
        <div className="w-16 bg-zinc-900 flex flex-col shrink-0 gap-3 items-center h-full">
            <ServerIcon key={"home"} name="Direct Messages" logo={"../src/assets/logo.png"} func="Home" activate={open} />
            {
                servers && servers.map((e)=>(
                    <ServerIcon key={e._id} id={e._id} name={e.name} logo={e.logo} func="Server" activate={open} />
                ))
            }
            <ServerIcon key="add_server" func="New" name="Add a server" logo={"../src/assets/yellow_cross.png"} activate={open}  />
            <div className={"absolute right-1/2 top-1/2 translate-x-1/2 -translate-y-1/2 "+(opened?"":"hidden")}>
                <AddServer userName={user} addServer={addServer} activate={close} />
            </div>
            <a className="flex items-center text-sm p-1 absolute bottom-0 text-center font-bold aspect-square rounded-3xl bg-red-400 cursor-pointer" onClick={logout} >Log Out</a>
        </div>
    )
}

export default ServerList