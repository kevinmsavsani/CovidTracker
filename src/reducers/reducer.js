

const reducer = (state, action) => {
  switch (action.type) {
		case 'SET_ITEMS_LIST':
			return {
				...state,
				items:action.items
			}
//----------------------------------------------------------------------------------------------------				
		case 'ADD_OFFLINE_LOG_ITEM':
				return {
					...state,
					offlineLogs:[...state.offlineLogs,action.message]
				}
		case 'CLEAR_OFFLINE_LOGS':
			return {
				...state,
				offlineLogs:new Array(),
				showOfflineBanner:false
			}
		case 'SHOW_OFFLINE_BANNER':
			return {
				...state,
				showOfflineBanner:true
			}
//----------------------------------------------------------------------------------------------------
    default:
      return {
        ...state
      }
  }
}

export default reducer