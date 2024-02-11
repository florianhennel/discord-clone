import { voiceChannel } from "./Channels"
import { UserInterface } from "./Chat"
import {useState,useEffect} from 'react';

interface Props{
    channel:voiceChannel,
    user:UserInterface,
}

function VoiceChannel({channel,user}:Props){
    const [users,setUsers] = useState<UserInterface[]>(channel.users);
    const joinChannel = ()=>{
        setUsers([user]);
    }
    return(
        <div className="text-white cursor-pointer" onClick={joinChannel}>
            <div className="">{channel.name}</div>
            {
                users &&users.map(user=>(
                    <div className="flex flex-row gap-4 items-center ml-4" key={user._id}>
                        <img src={`../src/assets/${user.picture}`} className=" w-6 rounded-full"/>
                        <div>{user.username}</div>
                    </div>
                ))
            }
        </div>
    )
}

export default VoiceChannel