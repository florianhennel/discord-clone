interface Props{
    user:string,
    picture:string,
    status?:string,
}

function User({user,picture,status}:Props){
    return (
        <div className="flex flex-row justify-start w-full gap-4 px-4 py-2 bg-neutral-800">
            <img className=" w-12 rounded-full aspect-square" src={`../src/assets/${picture}`} alt="pfp" />
            <div>
                <div className="text-white font-bold text-lg">
                    {user}
                </div>
                {
                    status && 
                    <div className=" text-neutral-300 font-normal text-sm">
                        {status}
                    </div>
                }
                
            </div>
        </div>
    )
}

export default User