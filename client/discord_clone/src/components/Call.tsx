import { useEffect, useRef, useState } from "react";
import { useSocket } from '../pages/SocketContext';
import { useParams } from "react-router-dom";

interface Props{
    outgoing:boolean,
    offer?:RTCSessionDescriptionInit,
}
function CallField({outgoing,offer}:Props){
    const localVideo = useRef<HTMLVideoElement | null>(null);
    const remoteVideo = useRef<HTMLVideoElement | null>(null);
    const socket = useSocket();
    const channel = useParams().id;
    const [localStream,setlocalStream] = useState<MediaStream>(new MediaStream());
    let remoteStream:MediaStream = new MediaStream();
    const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    let peerConnection:RTCPeerConnection = new RTCPeerConnection(configuration);
    
    peerConnection.ontrack = (event)=>{
        console.log("something");
        if(remoteStream){
            event.streams[0].getTracks().forEach(t=>{
                remoteStream.addTrack(t);
            });
        }
    }
    
    peerConnection.addEventListener('connectionstatechange', () => {
        console.log(peerConnection.connectionState);
    });

    peerConnection.onicecandidate = (event:RTCPeerConnectionIceEvent)=>{
        event.candidate && socket?.emit('sendIceCandidate',event.candidate,channel);
    };
    useEffect(()=>{
        if(localStream){
            localStream.getTracks().forEach(t=>{
                console.log("peerConnection.addTrack()");
                peerConnection.addTrack(t,localStream);
                
            })
        }
    },[localStream]);
    const call = async()=> {
        setlocalStream(await navigator.mediaDevices.getUserMedia({ video : true, audio : true}));
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
                    console.log(peerConnection);
                });
            });
        }
    }
    if (!socket?.hasListeners("receiveNewOffer")) {
        
        socket?.on("receiveNewOffer", async (newOffer) => {
            console.log("received newOffer");
            if(newOffer){
                await peerConnection.setRemoteDescription(new RTCSessionDescription(newOffer));
                const newAnswer = await peerConnection.createAnswer();
                peerConnection.setLocalDescription(newAnswer).then(()=>{
                    socket?.emit("sendNewAnswer",newAnswer,channel);
                    console.log("sent newAnswer");
                });
            }        
        });
    }
    const receive = async(offer:RTCSessionDescriptionInit)=>{
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

        setlocalStream(await navigator.mediaDevices.getUserMedia({ video : false, audio : true}));

        const answer = await peerConnection.createAnswer();
        peerConnection.setLocalDescription(answer).then(()=>{
            socket?.emit("sendAnswer",answer,channel);
            console.log("sent Answer");
        });
    }
    useEffect(()=>{
        outgoing?call():receive(offer!);
    },[])
    useEffect(() => {
        if (localVideo.current && localStream) {
          (localVideo.current as HTMLVideoElement).srcObject = localStream;
          console.log("setLocalVideo");
        }
        if (remoteVideo.current && remoteStream) {
            (remoteVideo.current as HTMLVideoElement).srcObject = remoteStream;
            console.log("setRemoteVideo");
          }
      }, [localStream,remoteStream]);
      socket?.on('receiveIceCandidate', async (candidate: RTCIceCandidate) => {
        try {
          if (peerConnection.remoteDescription) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            console.log('Successfully added IceCandidate!');
          } else {
            console.warn('Remote description not set. Ice candidate not added.');
          }
        } catch (e) {
          console.error('Error adding received ice candidate', e);
        }
      });
    return (
        <div className="flex gap-2">
            <div className=" rounded-lg bg-gray-600 aspect-video">
                <video ref={localVideo} id='localVideo' autoPlay playsInline muted></video>    
            </div>

            <div className=" rounded-lg bg-gray-600 aspect-video">
                <video ref={remoteVideo} id='remoteVideo' autoPlay playsInline muted></video>
            </div>
        <div>
            <button>Mic</button>
            <button>Cam</button>
        </div>
        </div>
    )
}

export default CallField;