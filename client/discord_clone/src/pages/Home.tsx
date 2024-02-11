import ServerList from "../components/ServerList";
import Messages from "../components/Messages";
import FriendList from "../components/FriendList";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./SocketContext";

export interface FriendInterface{
    _id:string,
    username:string,
    status:string,
    picture:string,
}
export interface MessageList{
  users:any[],
  _id:string,
  
}
function Home(){
    const navigate = useNavigate();
    const [servers,setServers] = useState<any[]>([]);
    const [user,setUser]  = useState("");
    const [friends,setfriends] = useState<FriendInterface[]>([]);
    const [fromRequests, setFromRequests] = useState<FriendInterface[]>([]);
    const [toRequests, setToRequests] = useState<FriendInterface[]>([]);
    const [picture,setPicture] = useState("");
    const [status,setStatus] = useState("");
    const [messages,setMessages] = useState<MessageList[]>([]);
    const socket = useSocket();
    const fetchingServers = async (token:string) => {
        if (token) {
            const response = await fetch(`https://jh4pgfv0-3000.euw.devtunnels.ms/home`, {
                method: "GET",
                headers:{
                    "authorization":token,
                    'Content-Type': 'application/json',
                  },
            });
  
            return await response.json();
        }
        else{
          navigate('../login');
        }
        
      }
    useEffect(()=>{
      const token = localStorage.getItem('token');
        token && fetchingServers(token).then((json)=>{
            setUser(json.user.username);
            setServers(json.servers);
            setfriends(json.friends);
            setFromRequests(json.fromRequests);
            setToRequests(json.toRequests);
            setPicture(json.user.picture);
            setStatus(json.user.status);
            setMessages(json.messages);
            console.log(json);
        });
    },[]);
    useEffect(()=>{
      messages.forEach((channel)=>{
              socket?.emit('join-channel',channel._id);
            })
    },[messages])
    return(
        <div className="flex h-full flex-row w-full">
                <ServerList serverList={servers} username={user} />
                <Messages user={user} picture={picture} messages={messages} status={status} />
                <FriendList friends={friends} fromRequests={fromRequests} toRequests={toRequests} />
        </div>
    )
}

export default Home