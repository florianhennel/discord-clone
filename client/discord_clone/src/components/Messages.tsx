import User from "./User"
import { MessageList } from "../pages/Home"
import MessageChannel from "./MessageChannel"

interface Props{
    user:string,
    messages:MessageList[],
    picture:string,
    status:string,
}

function Messages({user,messages,picture,status}:Props){
    return(
        <div className=" w-64 bg-neutral-700 flex flex-col">
            <div className=" text-white text-md text-center font-bold mt-4">Direct Messages</div>
            <div className="flex flex-col w-full ">
                {
                    messages.length>0?messages.map(msg=>(
                        <MessageChannel key={msg._id} name={msg.users} id={msg._id} picture={msg.users.length===1?msg.users[0].picture:""} status={msg.users.length===1?msg.users[0].status:""} />
                    ))
                    :<div>You have no friends</div>
                }
            </div>
            <div className=" mt-auto">
                <User user={user} picture={picture} status={status} />
            </div>
        </div>
    )
}

export default Messages