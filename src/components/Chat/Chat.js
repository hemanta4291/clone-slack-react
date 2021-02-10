import React, { useState, useEffect,useRef } from "react"
import db from "../../firebase"
import './Chat.css'
import { useParams } from "react-router-dom"
import StarBorderOutlineIcon from "@material-ui/icons/StarBorderOutlined"
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined"
import Message from '../Message/Message'
import ChatInput from '../ChatInput/ChatInput'

function Chat() {
    const { roomId } = useParams()
	const [roomDetails, setRoomDetails] = useState(null)
	const [roomMessages, setRoomMessages] = useState([])
	const [noMessages, setNoMessages] = useState(false)


	const messagesEndRef = useRef(null);
	// const scrollToBottom = () => {
		
	// };
	useEffect(()=>{
		messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
	}, [roomMessages]);


	useEffect(() => {
		if (roomId) {
			db.collection("rooms")
				.doc(roomId)
				.onSnapshot((snapshot) => setRoomDetails(snapshot.data()))
		}

		db.collection("rooms")
			.doc(roomId)
			.collection("messages")
			.orderBy("timestamp", "asc")
			.onSnapshot((snapshot) =>
				setRoomMessages(snapshot.docs.map((doc) => doc.data()))
			)
	}, [roomId])
	useEffect(() => {
		if (!roomMessages.length) setNoMessages(true)
		else setNoMessages(false)
	}, [roomMessages])

	const chatMessages = noMessages ? (
		<Message noMessages={noMessages} />
	) : (
		roomMessages.map(({ message, timestamp, user, userImage,uid}) => (
			<Message
			chanCreatorId={roomDetails?.chanCreatorId}
				message={message}
				timestamp={timestamp}
				user={user}
				userImage={userImage}
				key={timestamp}
				uid={uid}
			/>
		))
	)
	console.log(roomMessages)
	
    return (
        <div className="chat" id="chat__wrapper">
			<div className="chat__header">
				<div className="chat__headerLeft">
					<h4 className="chat__channelName">
						<span># {roomDetails?.name}</span>
						<StarBorderOutlineIcon />
					</h4>
				</div>
				<div className="chat__headerRight">
					<p>
						<InfoOutlinedIcon /> Details
					</p>
				</div>
			</div>
			<div className="chat__messages" id="chat__idmsg">{chatMessages} <div ref={messagesEndRef} /></div>
			<ChatInput channelName={roomDetails?.name} channelId={roomId} />
		</div>
    )
}

export default Chat
