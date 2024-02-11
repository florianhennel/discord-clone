import { FriendInterface } from "../pages/Home"
import { useNavigate } from "react-router-dom";

function Friend(friend:FriendInterface){
    const navigate = useNavigate();
    
    return(
        <div className="flex flex-row justify-start w-4/6 gap-4 px-4 py-2 bg-zinc-700 rounded-lg items-center">
            <img className=" w-16 rounded-full aspect-square" src={`../src/assets/${friend.picture}`} alt="pfp" />
            <div className="w-full">
                <div className=" flex text-white font-bold text-lg items-end h-3/5">
                    {friend.username}
                </div>
                <div className={`font-normal text-sm ${friend.status==="Online"?"text-lime-600":"text-rose-700"}`}>
                    {friend.status}
                </div>
            </div>
            <button onClick={
                async (e)=>{
                    try {
                        console.log(friend._id);
                        const token = localStorage.getItem('token');
                        if (token) {
                            const response = await fetch(`https://d1xppr12-3000.euw.devtunnels.ms/channel/friend/${friend._id}`,{
                                method:"GET",
                                headers:{
                                    "authorization":token,
                                    "Content-Type": 'application/json',
                                }
                            })
                            const st = await response.status;
                            const json = await response.json();
                            console.log(json);
                            if (st === 222) {
                                navigate(`../channel/${json.room}`);
                            }
                        }
                    } catch (error) {
                        console.error(error);
                        
                    }
                }
            } className="ml-auto text-center text-neutral-200">
                Message
            </button>
        </div>
    )
}

export default Friend