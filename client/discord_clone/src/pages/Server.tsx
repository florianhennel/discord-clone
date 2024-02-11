import { useState,useEffect,Suspense } from "react";
import { useParams } from "react-router-dom";
import ServerList from "../components/ServerList";
import Channels from "../components/Channels";
import { UserInterface } from "../components/Chat";
import ServerUsers from "../components/ServerUsers";
import TextChannel from "../components/TextChannel";
import { Message as MessageInterface } from "../components/Chat";
import { useSocket } from "./SocketContext";


interface TextChannelInterface{
    name:string,
    messages:MessageInterface[],
    _id:string,
}
function Server(){
    const {id} = useParams();
    const [isCOnnected,setIsCOnnected] = useState(false);
    const [servers,setServers] = useState<any[]>([]);
    const [name,setName] = useState("");
    const [username,setUsername] = useState("");
    const [users,setUsers] = useState([]);
    const [user,setUser] = useState<UserInterface>();
    const [textChannels,setTextChannels] = useState<TextChannelInterface[]>([]);
    const [voiceChannels,setVoiceChannels] = useState([]);
    const [activeChannel,setActiveChannel] = useState<TextChannelInterface>(textChannels[0]);
    const socket = useSocket();
    const fetching = async ()=>{
        const token = localStorage.getItem('token');
        if (token) {
           try {
            const response = await fetch(`https://jh4pgfv0-3000.euw.devtunnels.ms/server/${id}`,{
                method: "GET",
                headers:{
                    "authorization":token,
                    'Content-Type': 'application/json',
                  },
            });
            const json = await response.json();
            console.log(json);
            return json;
        } catch (error) {
            console.error(error);  
        } 
        }
    }
    useEffect(()=>{
        fetching().then((json)=>{
            setName(json.server.name);
            setTextChannels(json.textChannels);
            setVoiceChannels(json.server.voiceChannels);
            setUsers(json.serverUsers);
            setServers(json.userServers);
            setUsername(json.user.username);
            setUser(json.user);
            console.log(json);
        })
    },[id]);
    useEffect(()=>{
        setActiveChannel(textChannels[0]);
        textChannels.forEach(channel=>{
            socket?.emit("join-channel",channel._id);
        })
    },[textChannels]);
    const setChannel = (index:number)=>{
        setActiveChannel(textChannels[index]);
    }
    if (!activeChannel || !user) {
        return(
          <div className=" w-full h-full bg-zinc-500"></div>
        )
      }
    return(
  
        <div className="max-h-screen h-full flex flex-row">
            <ServerList username={username} serverList={servers} />
            <Channels active={setChannel} name={name} user={user} textChannels={textChannels} voiceChannels={voiceChannels} />
            <TextChannel user={user} messages={activeChannel.messages} name={activeChannel.name} channel_Id={activeChannel._id} />
            <ServerUsers users={users} />
        </div>
    )
}

export default Server