const reducer = (state, action) => {
  	switch (action.type) {
		case 'SET_ITEMS_LIST':
			return {
				...state,
				items:action.items
			}
		default:
			return {
				...state
			}
  }
}

export default reducer