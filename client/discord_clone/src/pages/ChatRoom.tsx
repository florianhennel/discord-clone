import { useState,useEffect } from "react"
import { useParams } from "react-router-dom"
import Messages from "../components/Messages";
import ServerList from "../components/ServerList";
import Chat from "../components/Chat";
import { UserInterface } from "../components/Chat";
import { io } from "socket.io-client";
const token = localStorage.getItem('token');
import { useSocket } from "./SocketContext";

export interface Channel{
  messages:any[],
  private:boolean,
  users:UserInterface[],
  _id:string,
}

function ChatRoom(){
    const channel = useParams().id;
    const socket = useSocket();
    const [servers,setServers] = useState<any[]>([]);
    const [user,setUser]  = useState<UserInterface>();
    const [picture,setPicture] = useState("");
    const [status,setStatus] = useState("");
    const [messages,setMessages] = useState<Channel[]>([]);
    const [chat,setChat] = useState<Channel>();
    

    const fetching = async () => {
        if (token) {
            const response = await fetch(`https://jh4pgfv0-3000.euw.devtunnels.ms/channel/${channel}`, {
                method: "GET",
                headers:{
                    "authorization":token,
                    'Content-Type': 'application/json',
                  },
            });
  
            return await response.json();
            
        }
        
      }
      useEffect(()=>{
        fetching().then((json)=>{
            setUser(json.user);
            setServers(json.servers);
            setPicture(json.user.picture);
            setStatus(json.user.status);
            setMessages(json.messages);
            console.log(json);
            
        });
        socket?.emit('join-channel',channel);
        
        
    },[channel]);
    useEffect(()=>{
      setChat(messages.find(m=>m._id === channel));
    },[messages])
    if (!chat || !user) {
      return(
        <div className=" w-full h-full bg-zinc-500"></div>
      )
    }

    return(
        <div className="flex h-full flex-row w-full">
            <ServerList serverList={servers} username={user.username} />
            <Messages user={user.username} picture={picture} messages={messages} status={status} />
            <Chat user={user} messages={chat.messages} _id={chat._id} users={chat.users} />
        </div>
    )
}

export default ChatRoom