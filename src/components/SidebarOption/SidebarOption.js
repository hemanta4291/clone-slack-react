import React,{useState,useEffect} from "react"
import { useHistory } from "react-router-dom"
import db, {auth} from "../../firebase"
import firebase from 'firebase'
import "./SidebarOption.css"

function SidebarOpiton({ id, Icon, title,addChannelOption,staticc }) {
	const history = useHistory()
	const [chanelCreators,setChannelCreators] = useState([])

	const selectChannel = () => {
		// console.log(chanelCreators)
		// console.log(id)
		if (id && auth.currentUser.uid === chanelCreators.chanCreatorId) {
			history.push(`/room/${id}`)
		}else if(chanelCreators.guser?.ch === true){
			history.push(`/room/${id}`)
		}else if(chanelCreators.guser?.ch === false){
			alert("you need to approve by admin")
			// history.push(`/room/${id}`)
		}  
		else {
			const reqTest = prompt("Type #Request# to join in channel" )

			if(reqTest === 'Request'){
				alert("Wellcome to in this Channel" )
				// history.push(`/room/${id}`)
				db.collection("rooms").doc(id).set({
					...chanelCreators,
					guser:{
						uid:auth.currentUser.uid,
						username: auth.currentUser.displayName,
						userImage: auth.currentUser.photoURL,
						ch:false
					}
				})
			}else{
				alert("plz Type #Request# to join in channel ")
			}
		}

	}
	const requestApproved=()=>{
		alert("appreved done")
		db.collection("rooms").doc(id).update({
			...chanelCreators,
			guser:{
				uid:auth.currentUser.uid,
				username: auth.currentUser.displayName,
				userImage: auth.currentUser.photoURL,
				ch:true
			}
		})
	}
	useEffect(() => {
		if (id) {
			db.collection("rooms")
				.doc(id)
				.onSnapshot((snapshot) => setChannelCreators(snapshot.data()))
		}
	}, [id])
	const noNeed=()=>{

	}
	const addChannel = () => {
		const channelName = prompt("Enter the channel name")

		if (channelName) {
			db.collection("rooms").add({
				name: channelName,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				chanCreatorId:auth.currentUser.uid,
				username: auth.currentUser.displayName,
				userImage: auth.currentUser.photoURL,
			})
		}
	}
	return (
		<div className="sidebarOption" onClick={(addChannelOption? addChannel: staticc? null:selectChannel)}>
			{
				auth.currentUser.uid === chanelCreators.chanCreatorId && chanelCreators.guser?.ch === false?(
				 <div className="requested__wrapper" onClick={requestApproved}>
					<h2> <span className="false__to__true"></span></h2>
					 <p>{chanelCreators.guser?.username} want to join {chanelCreators.name} channel</p>

				 </div>
				
				):''
			}
			{Icon && <Icon className="sidebarOption__icon" />}
			{Icon? (<h3>{title}</h3>):(<h3># {title}</h3>)}
		</div>
	)
}

export default SidebarOpiton
