import React, { useState, useEffect } from "react"
import "./Sidebar.css"
import SidebarOption from "../SidebarOption/SidebarOption"
// import { useStateValue } from "./StateProvider"
import db,{auth,provider} from "../../firebase"
import {Avatar} from "@material-ui/core"
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord"
import CreateIcon from "@material-ui/icons/Create"
import InsertCommentIcon from "@material-ui/icons/InsertComment"
import InboxIcon from "@material-ui/icons/Inbox"
import DraftsIcon from "@material-ui/icons/Drafts"
import BookmarkBorderIcon from "@material-ui/icons/BookmarkBorder"
import FileCopyIcon from "@material-ui/icons/FileCopy"
import PeopleAltIcon from "@material-ui/icons/PeopleAlt"
import AppsIcon from "@material-ui/icons/Apps"
import ExpandLessIcon from "@material-ui/icons/ExpandLess"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import AddIcon from "@material-ui/icons/Add"
import LoopIcon from "@material-ui/icons/Loop"
import { useStateValue } from "../../StateProvider"
import {useHistory} from 'react-router-dom'
import { actionTypes } from "../../reducer"


function Sidebar() {
	const [state, dispatch] = useStateValue()
	const [{ user }] = useStateValue()
	const [channels, setChannels] = useState([])
	// const [loading, setLoading] = useState("")
	const history = useHistory()

	useEffect(() => {
		db.collection("rooms").onSnapshot((snapshot) => {
			setChannels(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					name: doc.data().name,
				}))
			)
		})
	}, [])
	const logout=()=>{
		if(auth.signOut()){
			history.push("/")
			dispatch({
				type: actionTypes.SET_USER,
				user: null,
			})
		}
	}
	// useEffect(() => {
	// 	if (!channels.length)
	// 		setLoading(<SidebarOption Icon={LoopIcon} title="Loading..." />)
	// 	else setLoading("")
	// }, [channels])
	return (
		<div className="sidebar">
			<div className="sidebar__header">
				<div className="sidebar__info">
					{/* <h2>Slack-clone</h2>  */}
					<div className="logout" onClick={logout}>Logout</div>
					<Avatar src={user?.photoURL} alt={user?.displayName} />
					<h3>
						<FiberManualRecordIcon />
						{user?.displayName}
					</h3>
				</div>
				<CreateIcon />
			</div>
			<hr />
			<SidebarOption Icon={InboxIcon} title="Inbox" />
			<SidebarOption Icon={DraftsIcon} title="Drafts" />
			<SidebarOption Icon={BookmarkBorderIcon} title="Bookmark" />
			<SidebarOption Icon={FileCopyIcon} title="File" />
			<SidebarOption Icon={PeopleAltIcon} title="People" />
			<hr />

			<SidebarOption Icon={AddIcon} addChannelOption title="Add channel" />
			<hr/>
			{channels.map((channel) => (
					<SidebarOption
						key={channel.id}
						title={channel.name}
						id={channel.id}
					/>
				))}
		</div>
	)
}

export default Sidebar
