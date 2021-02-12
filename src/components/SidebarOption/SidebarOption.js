import React,{useState,useEffect} from "react"
import { useHistory } from "react-router-dom"
import db, {auth} from "../../firebase"
import firebase from 'firebase'
import "./SidebarOption.css"
import {Avatar} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import { Button,Input } from '@material-ui/core';
import {ArrowDropDown,ArrowDropUp} from '@material-ui/icons';
import Modal from '@material-ui/core/Modal';
// import { useStateValue } from "../../StateProvider"
// import { actionTypes } from "../../reducer"

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
  

function SidebarOpiton({ id, Icon, title,addChannelOption,staticc }) {
	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);
	const history = useHistory()
	const [chanelCreators,setChannelCreators] = useState([])
	const [gusers,setgusers] = useState([])
	const [guserSingle,setGuserSingle] = useState({})
	const [open,setOpen] = useState(false)
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
		let con = window.confirm("are you sure to approval him?")
		if(con){
			db.collection("rooms").doc(id).collection("gusers").doc(guId).update({
				ch: true
			})
		}
		
	}
	const anabDasable=(guId,ch)=>{
		if(ch){
			let con = window.confirm("are you sure to disable this account?")
			if(con){
				db.collection("rooms").doc(id).collection("gusers").doc(guId).update({
					ch: false
				})
				updategUsers()
			}
		}else{
			let con = window.confirm("are you sure to anable this account?")
			if(con){
				db.collection("rooms").doc(id).collection("gusers").doc(guId).update({
					ch: true
				})
				updategUsers()
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
	const modalUsers=()=>{
		if(auth.currentUser.uid === chanelCreators.chanCreatorId ){
			setOpen(true)
		}
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
				{Icon? (<h3>{title}</h3>):(<h3># {title} <span className="total__group__mamber" onClick={modalUsers}> { gusers.length}m</span></h3>)}
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

		<Modal
          open={open}
          onClose={() =>setOpen(false)}
        >
         <div style={modalStyle} className={classes.paper}>
         <form>
          <center>
            <h2 id="simple-modal-title">All Membars</h2>
              <ul className="group_m_wrapper">
			  {gusers?.map((gk,i) => (
					<li>{i+1}. {gk.data.user} {gk.data.ch?(<Button className="false" onClick={()=>anabDasable(gk.id,gk.data.ch)}>Disable</Button>):(<Button className="true" onClick={()=>anabDasable(gk.id,gk.data.ch)}>Anable</Button>)}
					{auth.currentUser.uid===gk.data.uid?(<span className="admin__abable">ad</span>):null}</li>
				))}
				  {/* {
					  gusers.length>0?
					  (gusers.map((gk)=>{
						<li>{gk.data.user}</li>
					})):''
				  } */}
			  </ul>
              
          </center>
          </form>
        </div>
      </Modal>
			
		</>

	)
}

export default SidebarOpiton
