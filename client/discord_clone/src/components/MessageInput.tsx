
import {ChangeEvent,useState} from 'react';
import { useParams } from 'react-router-dom';

interface Props{
    onData:any;
}

function MessageInput({onData}:Props){
    const channel = useParams().id;
    const  [message,setMessage] = useState<string>("");
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
      };
    const keyPressed = (event:React.KeyboardEvent<HTMLInputElement>)=>{
        if (event.key === "Enter" || event.key==="Go") {
            onData(message);
            setMessage("");
        }
    }
    return(
        <div className=' flex flex-row justify-center items-center text-center w-5/6 h-full'>
            <input className='w-full h-full rounded-xl bg-zinc-500 text-white p-3' type="text" value={message} name="text" id="text" title="asd" onChange={handleChange} onKeyDown={keyPressed} />
        </div>
    )
}

export default MessageInput