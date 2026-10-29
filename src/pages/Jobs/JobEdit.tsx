import { useParams } from "react-router"

function JobEdit(){
    const { id } = useParams()
    return <div> Edit {id} </div>
}

export default JobEdit