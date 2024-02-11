import {useState, useEffect} from  "react"
import FriendSorting from "./FriendSorting";
import InputField from "./InputField";
import {FriendInterface} from "../pages/Home"
import FriendRequest from "./FriendRequest";
import Friend from "./Friend";

interface Props{
    friends:any[],
    fromRequests:any[],
    toRequests:any[],
}


function FriendList({friends,fromRequests,toRequests}:Props){
    const [sort,setSort] = useState("Online");
    const [friendList,setFriendList] = useState<FriendInterface[]>([]);
    const [status,setStatus] = useState(0);
    const [newFriend,setNewFriend] = useState("");
    const [from,setFrom] = useState<any[]>([]);
    const [to,setTo] = useState<any[]>([]);

    const dataFromChild = (data:string)=>{
        setNewFriend(data);
    }
    const handleClick = (title:string)=>{
        setSort(title);
    }
    useEffect(()=>{
        setFrom(fromRequests);
    },[fromRequests]);
    useEffect(()=>{
        setTo(toRequests);
    },[toRequests]);
    useEffect(()=>{
        setFriendList(friends);
    },[friends]);
    const removeReq = (data:any)=>{
        if (typeof(data) != "string") {
           setFrom(from.filter(f=>{
                return f.username != data.username;
            }));
            setFriendList([...friendList,data]);
        }
        else{
            setFrom(from.filter(f=>{
                return f.username != data;
            }));
            setTo(to.filter(t=>{
                return t.username != data;
            }));
        }
        
        
        
    }
    return(
        <div className="flex flex-col w-5/6 bg-zinc-500 px-5 py-4 gap-2">
            
            <div className="flex flex-row gap-8">
                <FriendSorting onClick={handleClick} title="Online" active={sort==="Online"} />
                <FriendSorting onClick={handleClick} title="All" active={sort==="All"} />
                <FriendSorting onClick={handleClick} title="Pending" active={sort==="Pending"} />
                <FriendSorting onClick={handleClick} title="Blocked" active={sort==="Blocked"} />
                <FriendSorting onClick={handleClick} title="Add Friend" active={sort==="Add Friend"} />
            </div>
            {
                sort === "All" && <div className={`p-8 flex flex-col h-full gap-2 ${friendList.length?"justify-start":"justify-center"}`}>
                    {
                        friendList.length?friendList.map(friend=>(
                            <Friend key={friend._id} _id={friend._id} username={friend.username} picture={friend.picture} status={friend.status} />
                        )):<div className="text-white font-bold text-3xl text-center">No Friends...</div>
                    }
                </div>
            }
            {
                sort === "Add Friend" && <div className="bg-stone-800 flex flex-col items-center justify-center text-center self-center text-neutral-300 gap-5 p-10 rounded-xl">
                    <InputField onData={dataFromChild} type="text" status={status} label="Username" id="friend" name="friend" />
                    <button className="rounded-md w-28 h-12 bg-gradient-to-r from-teal-700 to-emerald-600 text-white text-base font-semibold" onClick={
                        async (e)=>{
                            e.preventDefault();
                            const token = localStorage.getItem("token");
                            if (token) {
                                try{      
                                    const response = await fetch("https://d1xppr12-3000.euw.devtunnels.ms/home/addfriend",{
                                        method:"POST",
                                        headers:{
                                            "authorization":token,
                                            'Content-Type': 'application/json',
                                        },
                                        body:JSON.stringify({
                                            friendReq:newFriend,
                                        })
                                    })
                                    const st = await response.status;
                                    const json = await response.json();
                                    setStatus(st);
                                    if(st===241){
                                        setTo([...to,json.friend]);
                                    }
                                    
                                    console.log(json);
                                }
                                catch (error){
                                console.error(error); 
                                }
                            }
                        }
                    }>Send Friend Request</button>
                </div>
            }
            {
                sort === "Pending" && 
                <div>
                    {
                        (!from.length && !to.length)?<div className="text-white font-bold text-3xl text-center">No pending Friend requests...</div>:
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-col gap-2">
                                    {
                                        from.length>0 && from.map(from=>(
                                            <FriendRequest key={from._id} _id={from._id} username={from.username} picture={from.picture} status={"Incoming Friend Request"} onData={removeReq} />
                                            
                                        ))
                                    }
                                </div>
                                <div>
                                    {
                                        to.length>0 && to.map(to=>(
                                            <FriendRequest onData={removeReq} key={to._id} _id={to._id} username={to.username} picture={to.picture} status={"Outgoing Friend Request"}  />
                                        ))
                                    }
                                </div>
                            </div>
                        
                        
                    }
                </div>
            }
            {
                sort === "Online" && <div className={`p-8 gap-2 flex flex-col h-full ${friendList.length?"justify-start":"justify-center"}`}>
                {
                    friendList.length?friendList.map(friend=>(
                        friend.status==="Online" && <Friend key={friend._id} _id={friend._id} username={friend.username} picture={friend.picture} status={friend.status} />
                    )):<div className="text-white font-bold text-3xl text-center">No Friends...</div>
                }
            </div>
            }
                
            
        </div>
    )
}

export default FriendList