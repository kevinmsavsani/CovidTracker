import React from "react"
import ReactDOM from "react-dom"
import { compose, createStore, applyMiddleware } from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import reducer from './reducers/reducer'
import './style.css';
import App from './App.jsx';
import reactImages from '../assets/react-logo.png'
import coronaImage from '../assets/corona.png'
import {processQueuedAsyncActions,onlineDetected, offlineDetected} from './actions/action'

const app = document.getElementById('app')

/*************************************************************************************
 * ONLINE/OFFLINE Event listeners
 * ===============================
 * These are dummy dispatches just so that I catch the change in network through 
 * myReduxStoreEnhancer
 *************************************************************************************/
window.addEventListener('online',   (event)=>  {
	store.dispatch({type:"YOU_ARE_ONLINE"})
	store.dispatch(onlineDetected("Looks like you are back Online"))}
)
window.addEventListener('offline',  (event)=>  store.dispatch(offlineDetected("You seem to have gone offline")))

/*****************************************************************************************
 * myReduxStoreEnhancer
 * ====================
 * An enhancer which will create the store to handle dispatch with Offline capabilities.
 * 
 * This is a very trivial scenario to use Enhancer and this fits to be a middle ware than
 * an enhancer. 
 *****************************************************************************************/


const myReduxStoreEnhancer = () => (createStore) => (reducer, preloadedState) => {

	const store = createStore(reducer, preloadedState)
	let pendingActions = []  //Storing Actions in-memory on going offline
	const dispatch = async(action) => {
		let actionReturned
		console.log("%c:: MY-REDUX-STORE-ENHANCER :: Action ::", 'background:#006064; color:#fff' ,action)

		if (action.type == "YOU_ARE_ONLINE"){ //Process all the queued up actions
			pendingActions.forEach(action => {
				store.dispatch(processQueuedAsyncActions(action.asyncItem))
			})
			pendingActions = []
			return actionReturned = store.dispatch({type:'OFFLINE_SYNC_COMPLETED'})
		}
		else {
			actionReturned = store.dispatch(action) 

			if (typeof actionReturned !== "function" && !!actionReturned){ //adding to the in-memory queue to Process for later
				 if (actionReturned.type == "PROCESS_WHEN_ONLINE"){
						pendingActions.push(actionReturned)
						console.log(actionReturned)
					}
			}
		}
		
		return actionReturned
	}
	
	store.subscribe(() => {
		console.log("%c:: MY-REDUX-STORE-ENHANCER :: State from Subscribe ::", 'background:#006064; color:#fff' ,store.getState())
		// if (!navigator.onLine){
			localStorage.setItem('persistedStore',JSON.stringify(store.getState()))
			console.log("%c:::::: PERSISTING-STORE ::::::", 'background:#000; color:orange')
		// }
	})

	return {
		...store,
		dispatch
	}

}
/*****************************************************************************************
 * store
 * =====
 * Redux store used in this app.
 * 
 * Inputs to create the store.
 * 1. reducer that I have created under reducer/reducer.js
 * 2. Initial State - To handle offline, it checks if there is any persisted state, else
 *                    initial only newItem to the state.
 * 3. Enhancers - 
 *       (i) applyMiddleware - To which we pass THUNK to handle async actions.
 *      (ii) myReduxStoreEnhancer - Custom enhancer build to handle Offline first Redux app
 *               (Not really required to be created as an Enhancer, and this very well fits
 *                to be a middleware, but just to show you the possibility of using an 
 *                enhancer.)
 *****************************************************************************************/
 
 const persistedStore = JSON.parse(localStorage.getItem('persistedStore'))||{}
 const store = createStore(
	reducer,
	{
		...persistedStore,
		offlineLogs:new Array()
	},
	compose(
		myReduxStoreEnhancer(),
		applyMiddleware(
			thunk,
		),
	)
)

/*****************************************************************************************
 * BOOTSTRAPPING REACT APP
 * =======================
 * Self Explanatory I hope :-)
 *****************************************************************************************/
ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>
	, app)