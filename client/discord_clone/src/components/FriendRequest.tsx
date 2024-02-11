
interface Props{
    _id:string,
    username:string,
    picture:string,
    status:string,
    onData:any,
}

function FriendRequest({_id,username,picture,status,onData}:Props) {
    const handleAccept = async ()=>{
        await handleFetch(true);
    }
    const handleDecline = ()=>{
        handleFetch(false);
    }
    const handleFetch = async (accept:boolean)=>{
            const token = localStorage.getItem('token');
            if (token) {
                const response = await fetch('https://d1xppr12-3000.euw.devtunnels.ms/acceptFriendRequest',{
                    method: "POST",
                    headers:{
                        "authorization":token,
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({
                        accept:accept,
                        friend:_id,
                    })
                })
                const json = await response.json();
                accept?onData(json.friend):onData(username);
                console.log(json);
            }
    }
    return(
        
        <div className="flex flex-row justify-start w-4/6 gap-4 px-4 py-2 bg-zinc-700 rounded-lg">
            <img className=" w-16 rounded-full aspect-square" src={`../src/assets/${picture}`} alt="pfp" />
            <div className="w-full">
                <div className=" flex text-white font-bold text-lg items-end h-3/5">
                    {username}
                </div>
                <div className=" text-neutral-300 font-normal text-sm">
                    {status}
                </div>
            </div>
            <div className="flex ml-auto p-2 gap-6">
                {status=== "Incoming Friend Request" && <a className=" cursor-pointer rounded-full bg-zinc-800 w-12 aspect-square p-2"><img src="../src/assets/check.png" alt="Accept" onClick={handleAccept} /></a>
                }
                <a className=" cursor-pointer rounded-full bg-zinc-800 aspect-square w-12"><img src="../src/assets/cross.png" alt="Cancel" onClick={handleDecline} /></a>
            </div>
        </div>
    )
    
}

export default FriendRequest