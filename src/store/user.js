import { createSlice } from '@reduxjs/toolkit'

const ID = 'id'

var initialState = {
	name: 'store/user.js',
	data: [],
	find: {}
}

export const userSlice = createSlice({
	name: 'store/user.js',
	initialState,
	reducers: {
		handleUser(state, action){
			state[action.payload.name] = action.payload.value
		},
		resetUser(state, action){
			state.data = action.payload || []
		},
		createUser(state, action){
			state.data.push(action.payload)
		},
		findOneUser(state, action){
			state.find = state.find((e) => e[ID] === action.payload) || {}
		},
		updateUser(state, action){
			state.data = state.data.map(e => {
    			if(e[ID] === action.payload[ID]){
    				e = Object.assign(e, action.payload)
    			}
    			return e
    		})
		},
		removeUser(state, action){
			state.data = state.data.filter(e => e[ID] !== action.payload)
		}
	},
	extraReducers: {},
})
// import {handleUser, resetUser, createUser, findOneUser, updateUser, removeUser} from @s/store/user.js
export const {handleUser, resetUser, createUser, findOneUser, updateUser, removeUser} = userSlice.actions

export default userSlice.reducer