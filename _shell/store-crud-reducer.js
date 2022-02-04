import { createSlice } from '@reduxjs/toolkit'

var initialState = {
	name: 'namestore',
	data: []
}

export const appSlice = createSlice({
	name: 'namestore',
	initialState,
	reducers: {
		handleNameExport(state, action){
			state[action.payload.name] = action.payload.value
		},
		resetNameExport(state, action){
			state.data = action.payload || []
		},
		createNameExport(state, action){
			state.data.push(action.payload)
		},
		updateNameExport(state, action){
			state.data = state.data.map(e => {
    			if(e.id === action.payload.id){
    				e = action.payload.data
    			}
    			return e
    		})
		},
		removeNameExport(state, action){
			state.data = state.data.filter(e => e.id !== action.payload)
		}
	},
	extraReducers: {},
})
// import
export const {handleNameExport, resetNameExport, createNameExport, updateNameExport, removeNameExport} = appSlice.actions

export default appSlice.reducer