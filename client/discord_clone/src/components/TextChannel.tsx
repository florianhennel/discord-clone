import MessageInput from "./MessageInput";
import Message from "./Message";
import User from "./User";
import { Message as MessageInterface, UserInterface } from "./Chat";
import {useState,useEffect,useRef} from 'react';
import { useSocket } from "../pages/SocketContext";


interface Props{
    user:UserInterface,
    messages:MessageInterface[],
    name:string,
    channel_Id:string,
}

function TextChannel({user,messages,name,channel_Id}:Props){
    const [msg,setMsg] = useState(messages);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const socket = useSocket();
    socket?.on("receive-message", (message:MessageInterface)=>{
        const messageObject = {
            msg:message.msg,
            from:message.from,
            when:message.when,
        }
        console.log(messageObject);
        setMsg([...msg,messageObject]);
    });
    const scrollToBottom = () => {
        if (messageContainerRef.current) {
          messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
      };
    useEffect(()=>{
        setMsg(messages);
        scrollToBottom();      
    },[messages]);
    const send = (message:string)=>{
        const sender:UserInterface = {
            _id:user._id,
            username:user.username,
            picture:user.picture,
            status:user.status,
        }
        const messageO = {
            msg:message,
            from:sender,
            when:new Date(),
        }
        socket?.emit("send-message",messageO,channel_Id);
        messages.push(messageO);
        setMsg([...msg,messageO]);
    }
    useEffect(()=>{
        scrollToBottom();
    },[msg])
    return(
        <div className="relative h-full max-h-full bg-zinc-700 flex flex-col flex-grow max-w-9/12 gap-2"> 
            <div className=" absolute top-0 w-full rounded-xl">
                <User user={name} picture={"group.png"} />
            </div>
            <div ref={messageContainerRef} className='flex flex-col min-w-full gap-2 p-2 mb-20 mt-16 overflow-y-auto overflow-x-hidden self-start w-full' >
                {
                    msg.length>0 && msg.map(mes=>(
                        <Message key={msg.lastIndexOf(mes)} username={mes.from.username} picture={mes.from.picture} message={mes.msg} date={mes.when} />
                    ))
                }
            </div>
            <div className="flex absolute bottom-0 w-full ml-12 mb-6 h-1/20">
                <MessageInput onData={send} />
            </div>
        </div>
    )
}

export default TextChannel