import React, { useState,useEffect} from "react"
import "./ChatInput.css"
import db,{auth} from "../../firebase"
import firebase from "firebase"
import { useStateValue } from "../../StateProvider"
import { useHistory } from "react-router-dom"

function ChatInput({ channelName, channelId }) {
	const [input, setInput] = useState("")
	const [{ user }] = useStateValue()
	const history = useHistory()
	const [gusers,setgusers] = useState([])
	const [guserSingle,setGuserSingle] = useState({})

	const updategUsers = () =>{
		if(channelId){
			db.collection("rooms")
			.doc(channelId)
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
	}, [channelId])
	useEffect(() => {
		updategUsers()
	}, [])

	const sendMessage = (e) => {
		e.preventDefault()
		if (!input) return false

		if (channelId) {
			// alert('dhukci')
			const singleUser =gusers.filter((grs)=> auth.currentUser.uid === grs.data.uid)
			// alert(singleUser[0].data.uid=== true && channelName)
			// alert(singleUser[0].data.uid=== false)
			if(singleUser[0].data.ch=== true && channelName){
				db.collection("rooms").doc(channelId).collection("messages").add({
					message: input,
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
					user: user.displayName,
					userImage: user.photoURL,
					uid: user.uid,
				})
			}
			if(singleUser[0].data.ch=== false){
				alert("your account is disbled plz check!")
				history.push(`/`)
			}
			if(!channelName){
				alert("This Channel allready has deleted")
				history.push(`/`)
			}
			// if(channelName){
			// 	db.collection("rooms").doc(channelId).collection("messages").add({
			// 		message: input,
			// 		timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			// 		user: user.displayName,
			// 		userImage: user.photoURL,
			// 		uid: user.uid,
			// 	})
			// }
			
			
		}
		setInput("")
	}

	return (
		<div className="chatInput">
			<form>
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder={`Message #${channelName}`}
				/>

				<button type="submit" onClick={sendMessage}>
					SEND
				</button>
			</form>
		</div>
	)
}

export default ChatInput
