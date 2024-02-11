interface Props{
    title:string,
    active:boolean,
    onClick:(name:string)=>void,
}

function FriendSorting({title,active,onClick}:Props){
    const handleClick = ()=>{
        onClick(title);
    }
    return(
        <div onClick={handleClick} className={`rounded-xl p-2 cursor-pointer text-center text-white ${active?" font-bold bg-zinc-600":"font-medium"}`}>
            {title}
        </div>
    )
}

export default FriendSorting