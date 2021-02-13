import React,{useState,useEffect} from "react"
import "./Message.css"
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import db, {auth} from "../../firebase"
import { Button,Input } from '@material-ui/core';


function getModalStyle() {
	const top = 50;
	const left = 50;
  
	return {
	  top: `${top}%`,
	  left: `${left}%`,
	  transform: `translate(-${top}%, -${left}%)`,
	};
  }
  
  const useStyles = makeStyles((theme) => ({
	paper: {
	  position: 'absolute',
	  width: 400,
	  backgroundColor: theme.palette.background.paper,
	  border: '2px solid #000',
	  boxShadow: theme.shadows[5],
	  padding: theme.spacing(2, 4, 3),
	},
  }));
const Message=({ noMessages,id,data,chanCreatorId,channelId })=> {
	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);
	const [open,setOpen] = useState(false)
	const [input, setInput] = useState(`${data?.message}`)

	const quickUp=()=>{
		setInput(`${data?.message}`)
	}
	const modalClose=()=>{
		setOpen(false)
		quickUp()
	}
	// Edit Message
	const editMessage=(e)=>{
		e.preventDefault()
		if (!input) return false
		if(auth.currentUser.uid === data.uid){
			let con = window.confirm("are you sure to update this message?")
			if(con){
				db.collection("rooms").doc(channelId).collection("messages").doc(id).update({
					message: input
				})
				.then(res=>{
					setOpen(false)
					quickUp()
				})
			}
		}else if(auth.currentUser.uid === chanCreatorId){
			let con = window.confirm("are you sure to update this message?")
			if(con){
				db.collection("rooms").doc(channelId).collection("messages").doc(id).update({
					message: input
				})
				.then(res=>{
					setOpen(false)
					quickUp()
				})
			}
		}
		else{
			alert("you can't edit,if you are not become admin")
			setOpen(false)
			quickUp()
		}
	}

	// delete from group by admin
	const deleteMessage=()=>{
		if(auth.currentUser.uid === data.uid){
			let con = window.confirm("are you sure to delete this message?")
			if(con){
				db.collection("rooms").doc(channelId).collection("messages").doc(id).delete()
				alert("message deleted by me")
				setOpen(false)
				quickUp()
			}
		}else if(auth.currentUser.uid === chanCreatorId){
			let con = window.confirm("are you sure to delete this message?")
			if(con){
				db.collection("rooms").doc(channelId).collection("messages").doc(id).delete()
				alert("message deleted by admin")
				setOpen(false)
				quickUp()
			}
		}
		else{
			alert("you can't delete,if you are not become admin")
			setOpen(false)
			quickUp()
		}
	}
	if (noMessages) return <div className="message">No messages...</div>
	return (
		<div className="message">
			<img src={data.userImage} alt="" />
			<div className="message__info">
				{chanCreatorId===data.uid?(<h4 className="adm">Ad</h4>):null}
				<h4>
					{data.user}
					<span className="message__timestamp">
						{new Date(data.timestamp?.toDate()).toLocaleDateString()}
					</span>
				<span className="more__all"><MoreVertIcon onClick={()=>setOpen(true)} /></span>
				</h4>
				<p>{data.message}</p>
			</div>



			<Modal
				open={open}
				onClose={modalClose}
				>
				<div style={modalStyle} className={classes.paper}>
				<center>
					<h2 id="simple-modal-title">Update!</h2>
					<div className="edit__wrapper">
						<form>
							<input
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="type anythings"
							/>

							<button type="submit" onClick={editMessage}>
								SEND
							</button>
						</form>
						<EditIcon />
					</div>
					<div className="delete__wrapper">
						<h>{data.user}</h>
						<DeleteForeverIcon onClick={deleteMessage}/>
					</div>
					

				</center>
				</div>
      		</Modal>
		</div>
	)
}

export default Message
