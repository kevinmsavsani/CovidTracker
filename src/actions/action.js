export const setItemsList = (data) => { return {
	type: "SET_ITEMS_LIST",
	items: data,
}}
/*********************************************
 * Offline Logging
 *********************************************/
const showOfflineBanner = () => ({
	type:"SHOW_OFFLINE_BANNER",
})

const addOfflineLogMessage = (message) => ({
	type:"ADD_OFFLINE_LOG_ITEM",
	message
})

const clearOfflineLogs = () =>( {
	type:"CLEAR_OFFLINE_LOGS"
})

export const onlineDetected = message => dispatch => {
	dispatch(addOfflineLogMessage(message))
	dispatch(clearOfflineLogs())
}

export const offlineDetected = message => dispatch => {
	dispatch(addOfflineLogMessage(message))
	dispatch(showOfflineBanner())
}

/*******************************************************************************
 *  Function to handle Fetch to
 *  		> Add New Item.
 * 			> Mark an item as complete or pending.
 *******************************************************************************/
export const processQueuedAsyncActions = (asyncItem) => (dispatch) =>  {

	fetch(asyncItem.url, {
			method: asyncItem.method,
			mode: 'cors',
			headers: new Headers({ "Content-Type": "application/json" }),
			body: asyncItem.body || ""
		})
			.then(res => res.json())
			.then(res => {
				if (asyncItem.successPassResponse){
					dispatch({...asyncItem.successAction,res:res})
				}
				else{
					dispatch(asyncItem.successAction)
				}
			})
			.catch(err => {
			})


}