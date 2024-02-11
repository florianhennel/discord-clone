import { useState, MouseEventHandler } from "react"
import { Link } from "react-router-dom"

interface Props{
    id?:string,
    logo:string,
    name:string,
    func: "Home" | "Server" | "New",
    activate:any,
}

function ServerIcon({logo,name,func,activate,id}:Props){
    
    const [hover,setHover] = useState(false);
    const handleHover = ()=>{
        setHover(true);
    }
    const handleLeave = ()=>{
        setHover(false);
    }
    const handleActivate:MouseEventHandler<HTMLAnchorElement>= ()=>{
        activate();
    }
    return(
         <Link to={func === "Server"?`/server/${id}`:(func === "Home"?"../home":"")} className={"flex flex-row aspect-square items-center justify-center text-center cursor-pointer bg-emerald-700 w-5/6 "+(!hover?"rounded-full":"rounded-2xl")} onClick={func==="New"?handleActivate:undefined} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
            {
                func != "New"?<img className={(func==="Home"? "w-8":"") + ""} src={logo} />:<img className="w-10" src={logo} />
            }
            <div className={(!hover?"invisible":"")+" absolute left-2.5 translate-x-14 rounded-lg bg-zinc-800 text-white p-3 font-semibold"}>{name}</div>
         </Link>
        
    )
}

export default ServerIcon