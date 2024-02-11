import { HTMLInputTypeAttribute,ChangeEvent, useEffect,useState } from "react";
interface Props{
    type: HTMLInputTypeAttribute,
    label:string,
    id:string,
    name:string,
    onData:any,
    status:Number,
    defaultName?:string,
}

function InputField({type,label,id,name,onData,status,defaultName}:Props){
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onData(event.target.value);
      };
      const [def,setDef] = useState<string>();
      useEffect(()=>{
        setDef(defaultName);
      },[defaultName])
    return (
        <div className="flex flex-col">
            <label htmlFor={id} className="text-neutral-300 text-sm text-left font-semibold uppercase">{label}</label>
            <input defaultValue={name==="create"&&def?def:""} onChange={handleChange} type={type} id={id} name={name} autoComplete="on" className="rounded-sm h-8 w-72 bg-teal-900 text-neutral-300" />
            {
                (name === 'SignUpEmail') && <span className={'text-red-800 text-xs'+(status != 421?' hidden':'')}>There’s already an account with this email address.</span>
            }
            {
                (name === 'LoginEmail') && <span className={'text-red-800 text-xs'+(status != 430?' hidden':'')}>Email not registered.</span>
            }
            {
                name ==='username' && <span className={'text-red-800 text-xs'+(status != 422?' hidden':'')}>There’s already an account with this username.</span>   
            }
            {
                (name === 'LoginPassword') && <span className={'text-red-800 text-xs'+(status != 431?' hidden':'')}>Incorrect password.</span>
            }
            {
                name==='invite' && <span className={'text-red-800 text-xs'+(status != 440?' hidden':'')}>You are already a member of this Server.</span> 
            }
            {
                name==='invite' && <span className={'text-red-800 text-xs'+(status != 420?' hidden':'')}>Invalid invitation code.</span> 
            }
            {
                name==='friend' && <span className={'text-red-800 text-xs'+(status != 490?' hidden':'')}>This user is already your Friend.</span>
            }
            {
                name==='friend' && <span className={'text-red-800 text-xs'+(status != 492?' hidden':'')}>This user doesn't exist.</span>
            }
            {
                name==='friend' && <span className={'text-red-800 text-xs'+(status != 491?' hidden':'')}>You have already sent a request to this user.</span>
            }
            
        </div>
    )
}

export default InputField