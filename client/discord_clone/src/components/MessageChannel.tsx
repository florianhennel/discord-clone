import { Link, useParams } from "react-router-dom";
import { useState,useEffect } from 'react'

interface Props{
    name:any[],
    id:string,
    picture:string,
    status:string,
}

function MessageChannel({name,id,picture,status}:Props){
    const param = useParams();
    const [names,setNames] = useState("");
    useEffect(()=>{
        if (name.length>1) {
            let str = "";
            name.forEach(n=>{str+=n.username+', '});
            setNames(str.slice(0,str.trim().length-1));
        }
        else{
            setNames(name[0].username);
        }
    },[])
    return(
        <Link to={`../channel/${id}`} className={`flex flex-row justify-start w-full gap-4 px-4 py-2 hover:bg-zinc-500 rounded-lg items-center ${param.id===id?"bg-zinc-500":""}`} >
            <img className=" w-12 rounded-full aspect-square" src={`../src/assets/${picture}`} alt="pfp" />
            <div className="w-full">
                <div className=" flex text-white font-bold text-lg items-end h-3/5">
                    {names}
                </div>
                <div className={`font-normal text-sm ${status==="Online"?"text-lime-600":"text-rose-700"}`}>
                    {status}
                </div>
            </div>
        </Link>
    )
}

export default MessageChannel