import {useState, useEffect} from 'react';
import { useParams } from "react-router-dom";
import User from "./User";
import MessageInput from './MessageInput';
import Message from './Message';
import { useSocket } from '../pages/SocketContext';
import CallField from './Call';

interface Props{
    _id:any,
    messages:Message[],
    users:UserInterface[],
    user:UserInterface,
}
export interface UserInterface{
    picture:string,
    status:string,
    username:string,
    _id:string,
}
export interface Message{
    from:UserInterface,
    msg:string,
    when:Date,
}
function Chat({messages,users,user}:Props){
    const channel = useParams().id;
    const socket = useSocket();
    const [friend,setFriend] = useState<UserInterface>();
    const [friends,setFriends] = useState<string>("");
    const [msg,setMsg] = useState(messages);
    const [localStream,setlocalStream] = useState<MediaStream>();
    const [remoteStream,setremoteStream] = useState<MediaStream>();
    const [call,setCall] = useState<boolean>(false);
    const [receive,setReceive] = useState<boolean>(false);
    const [offer,setOffer] = useState<RTCSessionDescriptionInit>();
    const configuration:RTCConfiguration =
    {
        iceServers:[
            {
                urls:'stun:stun.l.google.com:19302',
            },
            {
                urls:'stun:stun1.l.google.com:19302',
            },
        ],
        iceTransportPolicy:'all',  
    } 
    useEffect(()=>{
        if (users.length>1) {
            let str = "";
            users.forEach(user=>{str+=user.username+', '});
            setFriends(str.slice(0,str.trim().length-1));
        }
        else{
            setFriend(users[0]);
        }
        
    },[users]);
    useEffect(()=>{
        setMsg(messages);
    },[messages])
    socket?.on("receive-message", (message:Message)=>{
        const messageObject = {
            msg:message.msg,
            from:message.from,
            when:message.when,
        }
        console.log(messageObject);
        setMsg([...msg,messageObject]);
    });
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
        socket && socket.emit("send-message",messageO,channel);
        setMsg([...msg,messageO]);
    }
    /*const Call = async()=> {
        const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
        const peerConnection = new RTCPeerConnection(configuration);
        peerConnection.addEventListener('icecandidate',(event:RTCPeerConnectionIceEvent)=>{
            event.candidate && socket?.emit('sendIceCandidate',event.candidate,channel);
        });
        peerConnection.addEventListener('connectionstatechange', event => {
            console.log(peerConnection.connectionState);
            
        });
        setlocalStream(await navigator.mediaDevices.getUserMedia({ video : true, audio : true}));
        setremoteStream(new MediaStream());
        if(localStream){
            localStream.getTracks().forEach(t=>{
                console.log("peerConnection.addTrack()");
                peerConnection.addTransceiver(t,{streams:[localStream!]});
            })
        }
         peerConnection.ontrack = (event)=>{
            console.log("something");
            event.streams[0].getTracks().forEach(t=>{
                remoteStream?.addTrack(t);
            })
        }

        const offer = await peerConnection.createOffer({offerToReceiveAudio:true,offerToReceiveVideo:true});
        await peerConnection.setLocalDescription(offer).then(()=>{
            socket?.emit("sendOffer",offer,channel);
            console.log("sent Offer");
        });
        
        
        if (!socket?.hasListeners("receiveAnswer")){
            socket?.on('receiveAnswer',async (answer:RTCSessionDescriptionInit)=>{
                console.log("received Answer");
                    const remote = new RTCSessionDescription(answer);
                    await peerConnection.setRemoteDescription(remote).then(async ()=>{
                        setInCall(true);
                        console.log(peerConnection);
                    });
            });
        }
        socket?.on('receiveIceCandidate',async(candidate:RTCIceCandidate)=>{
            try {
                await peerConnection.addIceCandidate(candidate).then(()=>{
                    console.log("Successfully added IceCandiadate!");
                });
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        })  
        
    } */ 
    if (!socket?.hasListeners("receiveOffer")) {
        
        socket?.on("receiveOffer", (offer) => {
            console.log("received Offer");
            if(offer){
                setOffer(offer);
                setReceive(true);
            }        
        });
    }
    /*const sendAnswer = async (offer:RTCSessionDescriptionInit)=>{
        const pc = new RTCPeerConnection(configuration);
        pc.addEventListener('icecandidate',(event:RTCPeerConnectionIceEvent)=>{
            event.candidate && socket?.emit('sendIceCandidate',event.candidate,channel);
        });
        pc.addEventListener('connectionstatechange', event => {
            if (pc.connectionState === 'connected') {
                console.log("Peers connected!");
                setInCall(true);
            }
        });
        pc.addEventListener('track', ()=>{
            console.log('pc2 received remote stream');
        });
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        setlocalStream(await navigator.mediaDevices.getUserMedia({ video : true, audio : true}));
        setremoteStream(new MediaStream());

        if(localStream){
            localStream.getTracks().forEach(t=>{
                console.log("pc.addTrack()");
                pc.addTransceiver(t,{streams:[localStream!]});
            }) 
        }
        pc.ontrack = (event)=>{
            console.log("something");
            event.streams[0].getTracks().forEach(t=>{
                remoteStream?.addTrack(t);
            })
        }

        const answer = await pc.createAnswer();
        pc.setLocalDescription(answer).then(()=>{
            socket?.emit("sendAnswer",answer,channel);
            console.log("sent Answer");
        });
        
        socket?.on('receiveIceCandidate',async(candidate:RTCIceCandidate)=>{
            try {
                await pc.addIceCandidate(candidate).then(()=>{
                    console.log("Successfully added IceCandiadate!");
                });
            } catch (e) {
                console.error('Error adding received ice candidate', e);
            }
        })
        

    }*/
    const initiateCall = async ()=>{
        setCall(true);
        //Call();
        console.log("called");
    }
    return(
        <div className="w-5/6 h-full bg-zinc-700 flex flex-col max-w-5/6 gap-2 overflow-x-hidden">
            <div className="flex justify-start rounded-xl">
                <User user={friend?friend.username:friends} picture={friend?friend.picture:"group.png"} status={friend?friend.status:undefined} />
                <div className='flex bg-zinc-800 text-white items-center w-12 cursor-pointer' onClick={initiateCall}>
                    Call
                </div>
            </div>
            {
                (call ||receive) && <CallField outgoing={call} offer={receive?offer:undefined} />
            }
            <div className=' h-full scroll-m-0 flex flex-col gap-2 justify-end p-2 ml-3'>
                {
                    msg.length>0 && msg.map(mes=>(
                        <Message key={msg.indexOf(mes)} username={mes.from.username} picture={mes.from.picture} message={mes.msg} date={mes.when} />
                    ))
                }
            </div>
            <div className="flex mt-auto w-full ml-12 mb-6 h-1/20">
                <MessageInput onData={send} />
            </div>
        </div>
    )
}

export default Chat