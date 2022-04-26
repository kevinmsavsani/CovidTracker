import React from "react"
import ReactDOM from "react-dom"
import { compose, createStore, applyMiddleware } from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import reducer from './reducers/reducer'
import './style.css';
import App from './App.jsx';
import reactImages from './assets/react-logo.png'
import coronaImage from './assets/corona.png'

const app = document.getElementById('app')

const myReduxStoreEnhancer = () => (createStore) => (reducer, preloadedState) => {

	const store = createStore(reducer, preloadedState)
	const dispatch = async(action) => {
		let actionReturned
		actionReturned = store.dispatch(action) 
		return actionReturned
	}
	
	store.subscribe(() => {
		console.log("%c:: MY-REDUX-STORE-ENHANCER :: State from Subscribe ::", 'background:#006064; color:#fff' ,store.getState())
			localStorage.setItem('persistedStore',JSON.stringify(store.getState()))
			console.log("%c:::::: PERSISTING-STORE ::::::", 'background:#000; color:orange')
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
	},
	compose(
		myReduxStoreEnhancer(),
		applyMiddleware(
			thunk,
		),
	)
)

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>
	, app)