import React,{useEffect} from "react"
import './App.css';
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Chat from './components/Chat/Chat'
import Login from './components/Login/Login'
import { auth } from "./firebase"
import { useStateValue } from "./StateProvider"
import { actionTypes } from "./reducer"



function App() {
  const [{ user }, dispatch] = useStateValue()
  useEffect( () =>{
		const unscriber = auth.onAuthStateChanged((authUser)=>{
		  if(authUser){
			dispatch({
				type: actionTypes.SET_USER,
				user: authUser,
			})
		  }else{
			
		  }
		})
		return ()=>{
		  unscriber();
		}
	},[])
  return (
    <div className="App">
      <Router>
        {!user?(<Login />):
        (
          <>
            <Header />
            <div className="app__body">
              <Sidebar/>
                <Switch>
                  <Route path="/room/:roomId"><Chat /></Route>
                  <Route path="/"><h1 className="welcome__h1">wellcome to salck</h1></Route>
                </Switch>
            </div>
          </>
        )}
      </Router>
    </div>
  );
}

export default App;
