import { UserInterface } from "./Chat"
import MessageChannel from "./MessageChannel"
import User from "./User"

 interface Props{
    users:UserInterface[],
 }

 
 function ServerUsers({users}:Props){
    return(
        <div className=" w-64 flex flex-col shrink-0 h-full bg-zinc-600 ">
            {
                users.map(user=>(
                    <MessageChannel key={user._id} name={[user]} id={user._id} picture={user.picture} status={user.status} />
                    
                ))
            }
        </div>
    )
 }

 export default ServerUsers