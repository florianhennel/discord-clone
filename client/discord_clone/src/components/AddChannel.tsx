import {useState,useEffect,MouseEventHandler} from 'react';
import { useParams } from 'react-router-dom';
import InputField from './InputField';
 
interface Props{
    close:any,
}

function addChannel({close}:Props){
    const channel = useParams().id;
    const [status,setStatus] = useState(0);
    const [code,setCode] = useState("");
    const [mouseOnX,setMouseOnX] = useState(false);
    const [name,setName] = useState("");
    const [textRadioChecked,setTextRadioChecked] = useState(true);
    const codeFromChild = (code :string)=>{
        setCode(code);
    }
    const nameFromChild = (nam :string)=>{
        setName(nam);
    }
    const mouseOn = ()=>{
        setMouseOnX(true);
    }
    const mouseOff = ()=>{
        setMouseOnX(false);
    }
    const closeWindow:MouseEventHandler<HTMLAnchorElement>= ()=>{
        close();
    }
    return(
        <div className=" bg-stone-800 flex flex-col items-center justify-center text-center text-neutral-300 gap-10 p-10 rounded-xl">
            <div className=" flex flex-col text-center items-center gap-5 p-10">
                <a onClick={closeWindow} className={"absolute top-0 right-3 text-3xl cursor-pointer "+(mouseOnX?"text-red-600":"text-neutral-300")} onMouseEnter={mouseOn} onMouseLeave={mouseOff} >x</a>     
                <div className="text-neutral-200 text-4xl font-bold uppercase">
                    Create a channel!
                </div>
                <div className='flex flex-col gap-4 p-4 w-3/4 rounded-md bg-zinc-700'>
                    <div className={`flex flex-row justify-between p-2 ${textRadioChecked?" bg-teal-700":" bg-teal-900"}`} onClick={()=>{setTextRadioChecked(true)}}>
                        <label className='cursor-pointer' htmlFor="textRadio">Text Channel</label>
                        <input type="radio" name="channelType" id="textRadio" checked={textRadioChecked}/>
                    </div>
                    <div className={`flex flex-row justify-between p-2 ${textRadioChecked?"bg-teal-900":"bg-teal-700"}`} onClick={()=>{setTextRadioChecked(false)}}>
                        <label className=' cursor-pointer' htmlFor="voiceRadio">Voice Channel</label>
                        <input type="radio" name="channelType" id="voiceRadio" checked={!textRadioChecked} />
                    </div>
                </div>
                <div className=" flex flex-col text-center items-center gap-5 p">
                    <div>
                    Whats the name of the channel gonna be!
                    </div>
                    <InputField onData={nameFromChild} type="text" name="create" id="channelCreate" label="Channel name" status={status} />
                </div>
                <button onClick={async (e)=>{
                        e.preventDefault();
                        const token = localStorage.getItem("token");
                        if (token) {
                            try{      
                                const response = await fetch(`https://d1xppr12-3000.euw.devtunnels.ms/server/${channel}/addchannel`,{
                                    method:"POST",
                                    headers:{
                                        "authorization":token,
                                        'Content-Type': 'application/json',
                                    },
                                    body:JSON.stringify({
                                        textChannel:textRadioChecked,
                                        name:name,
                                    })
                                })
                                const json = await response.json();
                                if (response.status == 210) {
                                    console.log(json);
                                }
                        
                            }
                            catch (error){
                                console.error(error); 
                            }
                        }
                    
                    }} className="rounded-sm p-2 bg-gradient-to-r from-teal-700 to-emerald-600 text-white text-base font-semibold">
                        Add Channel
                </button>
            </div>
        </div>

    )
 }

 export default addChannel