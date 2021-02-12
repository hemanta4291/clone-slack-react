import React,{useState,useEffect} from "react"
import { useHistory } from "react-router-dom"
import db, {auth} from "../../firebase"
import firebase from 'firebase'
import "./SidebarOption.css"
import {Avatar} from "@material-ui/core"
// import { useStateValue } from "../../StateProvider"
// import { actionTypes } from "../../reducer"

function SidebarOpiton({ id, Icon, title,addChannelOption,staticc }) {
	const history = useHistory()
	const [chanelCreators,setChannelCreators] = useState([])
	const [gusers,setgusers] = useState([])
	const [guserSingle,setGuserSingle] = useState({})
	// const [state, dispatch] = useStateValue()
	// const [{gusers}] = useStateValue()
	const updategUsers = () =>{
		if(id){
			db.collection("rooms")
			.doc(id)
			.collection("gusers")
			.orderBy("timestamp", "asc")
			.onSnapshot((snapshot) =>{
				// setgusers(snapshot.docs.map((doc) => doc.data()))
			setgusers(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					data: doc.data()
				}))
			)
			}
			
			)	
		}
	}
	useEffect(() => {
		updategUsers()
	}, [id])
	useEffect(() => {
		updategUsers()
	}, [])
	const selectChannel = () => {
		if(id){
			if(gusers.length>0){
				setGuserSingle(
					gusers.filter((grs)=> auth.currentUser.uid === grs.data.uid)
				)
					const singleUser =gusers.filter((grs)=> auth.currentUser.uid === grs.data.uid)
					if(singleUser.length>0){
						const expr = true;
					switch (expr) {
					case auth.currentUser.uid === chanelCreators.chanCreatorId && singleUser[0].data.ch === true:
						history.push(`/room/${id}`)
						updategUsers()
						break;
					case auth.currentUser.uid === singleUser[0].data.uid && singleUser[0].data.ch=== false:
						alert("you need approval to join in group by admin")
						updategUsers()
						break;
					case auth.currentUser.uid === singleUser[0].data.uid && singleUser[0].data.ch=== true:
						history.push(`/room/${id}`)
						updategUsers()
						break;
					default:
						const reqTest = prompt("Type #Request# to join in channel" )
						if(reqTest === 'Request' ){
							db.collection("rooms").doc(id).collection("gusers").add({
								ch: false,
								timestamp: firebase.firestore.FieldValue.serverTimestamp(),
								user: auth.currentUser.displayName,
								userImage: auth.currentUser.photoURL,
								uid: auth.currentUser.uid,
							})
							.then(res=>{
								if(res){
									updategUsers()
								}
							})
						}
					}
					}else{
						if(chanelCreators.chanCreatorId === auth.currentUser.uid){
							db.collection("rooms").doc(id).collection("gusers").add({
								ch: true,
								timestamp: firebase.firestore.FieldValue.serverTimestamp(),
								user: auth.currentUser.displayName,
								userImage: auth.currentUser.photoURL,
								uid: auth.currentUser.uid,
							})
							.then(res=>{
								if(res){
									updategUsers()
									history.push(`/room/${id}`)
								}
							})
						}else{
							const reqTest = prompt("Type #Request# to join in channel" )
							if(reqTest === 'Request' ){
							db.collection("rooms").doc(id).collection("gusers").add({
								ch: false,
								timestamp: firebase.firestore.FieldValue.serverTimestamp(),
								user: auth.currentUser.displayName,
								userImage: auth.currentUser.photoURL,
								uid: auth.currentUser.uid,
							})
							.then(res=>{
								if(res){
									updategUsers()
								}
							})
						}
						}
					}
					

			}
			else{
				if(chanelCreators.chanCreatorId === auth.currentUser.uid){
					db.collection("rooms").doc(id).collection("gusers").add({
						ch: true,
						timestamp: firebase.firestore.FieldValue.serverTimestamp(),
						user: auth.currentUser.displayName,
						userImage: auth.currentUser.photoURL,
						uid: auth.currentUser.uid,
					})
					.then(res=>{
						if(res){
							updategUsers()
							history.push(`/room/${id}`)
						}
					})
				}else{
					const reqTest = prompt("Type #Request# to join in channel" )
						if(reqTest === 'Request' ){
							db.collection("rooms").doc(id).collection("gusers").add({
								ch: false,
								timestamp: firebase.firestore.FieldValue.serverTimestamp(),
								user: auth.currentUser.displayName,
								userImage: auth.currentUser.photoURL,
								uid: auth.currentUser.uid,
							})
							.then(res=>{
								if(res){
									updategUsers()
								}
							})
						}
				}
			}
		}
	}
	const requestApproved=(guId)=>{
		let con = window.confirm("are you sure to approval him")
		if(con){
			db.collection("rooms").doc(id).collection("gusers").doc(guId).update({
				ch: true
			})
		}
		
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
		<>
			<div className="sidebarOption" onClick={(addChannelOption? addChannel: staticc? null:selectChannel)}>

				{/* {

					auth.currentUser.uid === chanelCreators.chanCreatorId && chanelCreators.guser?.ch === false?(
					<div className="requested__wrapper" onClick={requestApproved}>
						<h2> <span className="false__to__true"></span></h2>
						<p>{chanelCreators.guser?.username} want to join {chanelCreators.name} channel</p>

					</div>
					
					):''
				} */}
				{Icon && <Icon className="sidebarOption__icon" />}
				{Icon? (<h3>{title}</h3>):(<h3># {title}</h3>)}
			</div>
			{gusers.length>0?(
				<div className="request__top__wrapper">
				{gusers?.map((gus) => (
					auth.currentUser.uid===chanelCreators.chanCreatorId && gus.data.ch===false?
					(
						<div className="requested__wrapper" onClick={()=>requestApproved(gus.id)}>
							<Avatar src={gus.data.user} alt={gus.data.user} />
							<p>{gus.data.user} want to join <span className="channle__color"># {chanelCreators.name}</span> channel</p>
	
						</div>
					):''
				))}
				</div>
				
			):(<div></div>)}
			
		</>

	)
}

export default SidebarOpiton
