
interface Props{
    picture:string,
    username:string,
    date:Date,
    message:string,
}

function Message({picture,username,date,message}:Props){
    return(
        <div className="flex flex-row w-full hover:bg-zinc-600 gap-3 max-w-full">
            <img className="w-10 max-h-10 rounded-full aspect-square" src={`../src/assets/${picture}`} alt="" />
            <div className="flex flex-col">
                <div className="flex flex-row gap-2 text-center text-white">
                    <div className="">{username}</div>
                    <div className="font-thin text-xs">{date.toString()}</div>
                </div>
                <div className="text-white break-before-all">
                    {message}
                </div>
            </div>
        </div>
    )
}

export default Message