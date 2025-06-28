import { useParams } from "react-router-dom"

export default function Dashboard(){

 const {username} = useParams()
 console.log(username)
return(
    <div className="Dashboard">
        <h1>Dashboard  {username}</h1>
    </div>
)

}