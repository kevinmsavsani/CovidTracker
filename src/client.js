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

const persistedStore = JSON.parse(localStorage.getItem('persistedStore'))||{}
 const store = createStore(
	reducer,
	{
		...persistedStore,
	},
	compose(
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