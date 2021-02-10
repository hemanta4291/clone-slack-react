import firebase from "firebase"

const firebaseConfig = {
	apiKey: "AIzaSyBZyrtQ28o4rzoJfH5swVrESSGOOypW5vE",
	authDomain: "slack-clone-react-1e447.firebaseapp.com",
	projectId: "slack-clone-react-1e447",
	storageBucket: "slack-clone-react-1e447.appspot.com",
	messagingSenderId: "170156370641",
	appId: "1:170156370641:web:336ef58444535e49a633f0",
	measurementId: "G-5XES1Q819X"
}

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { auth, provider }
export default db
