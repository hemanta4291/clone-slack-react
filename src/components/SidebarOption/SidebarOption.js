import React,{useState,useEffect} from "react"
import { useHistory } from "react-router-dom"
import db, {auth} from "../../firebase"
import "./SidebarOption.css"

function SidebarOpiton({ id, Icon, title,addChannelOption  }) {
	const history = useHistory()
	const [chanelCreators,setChannelCreators] = useState([])

	const selectChannel = () => {
		// console.log(chanelCreators)
		// console.log(id)
		if (id && auth.currentUser.uid === chanelCreators.chanCreatorId) {
			history.push(`/room/${id}`)
		}else if(chanelCreators.guser?.ch === true){
			history.push(`/room/${id}`)
		} 
		else {
			const reqTest = prompt("Type #Request# to join in channel" )

			if(reqTest === 'Request'){
				alert("Wellcome to in this Channel" )
				history.push(`/room/${id}`)
				db.collection("rooms").doc(id).set({
					...chanelCreators,
					guser:{
						uid:auth.currentUser.uid,
						username: auth.currentUser.displayName,
						userImage: auth.currentUser.photoURL,
						ch:true
					}
				})
			}else{
				alert("plz Type #Request# to join in channel ")
			}
		}

	}
	useEffect(() => {
		if (id) {
			db.collection("rooms")
				.doc(id)
				.onSnapshot((snapshot) => setChannelCreators(snapshot.data()))
		}
	}, [id])

	const addChannel = () => {
		const channelName = prompt("Enter the channel name")

		if (channelName) {
			db.collection("rooms").add({
				name: channelName,
				chanCreatorId:auth.currentUser.uid,
				username: auth.currentUser.displayName,
				userImage: auth.currentUser.photoURL,
			})
		}
	}
	return (
		<div className="sidebarOption" onClick={addChannelOption? addChannel:selectChannel}>
			{Icon && <Icon className="sidebarOption__icon" />}
			{Icon? (<h3>{title}</h3>):(<h3># {title}</h3>)}
		</div>
	)
}

export default SidebarOpiton
