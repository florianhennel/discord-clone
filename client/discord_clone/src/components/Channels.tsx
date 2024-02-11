import { useEffect, useState } from "react";
import TextVoiceChannelBanner from "./TextVoiceChannelBanner";
import VoiceChannel from "./VoiceChannel";
import { UserInterface } from "./Chat";

interface Props{
    name:string,
    textChannels:any[],
    voiceChannels:any[],
    user:UserInterface,
    active:any,
}
export interface voiceChannel{
    _id:string,
    name:string,
    users:UserInterface[],
}

function Channels({name,textChannels,voiceChannels,active,user}:Props){
    const [text,setText] = useState<any[]>([]);
    const [voice,setVoice] = useState<voiceChannel[]>([]);
    const [activeChannel,setActiveChannel] = useState(0);
    const handleActivate = (key:number)=>{
        active(key);
        setActiveChannel(key);
    }
    useEffect(()=>{
        setText(textChannels);
        console.log(textChannels);
    },[textChannels]);
    useEffect(()=>{
        setVoice(voiceChannels);
    },[voiceChannels]);

    return(
        <div className=" w-64 bg-zinc-600 flex flex-col shrink-0">
            <div className="text-white text-xl text-center">{name}</div>
            <div>
                <TextVoiceChannelBanner textVoice="text" />
                <div>
                    {
                        text.length && text.map((channel)=>(
                            <div onClick={() => handleActivate(text.indexOf(channel))} className={`${text.indexOf(channel)===activeChannel?"bg-zinc-900":""}text-white cursor-pointer`} key={text.indexOf(channel)}>
                                {channel.name}
                            </div>


                        ))
                    }
                </div>
            </div>
            <div>
            <TextVoiceChannelBanner textVoice="voice" />
                <div>
                    {
                        voice.length && voice.map((channel)=>(
                            <VoiceChannel key={channel.name} channel={channel} user={user}/>
                            
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Channels