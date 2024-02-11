import { useState } from "react"
import AddChannel from "./AddChannel";

interface Props{
    textVoice:"text"|"voice",
}

function TextVoiceChannelBanner({textVoice}:Props){
    const [addChannelVisible,setAddChannelVisible] = useState<boolean>(false);
    const addChannel = ()=>{
        setAddChannelVisible(true);
    }
    const removeAddChannelWindow = ()=>{
        setAddChannelVisible(false);
    }
    const addTextChannel = ()=>{

    }
    const addVoiceChannel = ()=>{
        
    }
   return(
    <div className="flex flex-row justify-between items-center p-1 cursor-pointer">
        <div className=" text-neutral-400 uppercase text-xs font-mono hover:text-white">{textVoice} channels</div>
        <div className=" text-neutral-400 hover:font-bold hover:text-white" onClick={addChannel}>+</div>
        <div className={`flex absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 ${addChannelVisible?"":"hidden"}`}>
            <AddChannel close={removeAddChannelWindow} />
        </div>
    </div>
   ) 
}

export default TextVoiceChannelBanner