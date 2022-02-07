import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
// CONFIG
const BASE = 'http://localhost:8000/api/user'
const ID = 'id'
// setup your headers in here
const headers = {
	'Content-Type': 'application/json'
}
const stringify = (data) => JSON.stringify(data)

var initialState = {
	name: 'user',
	data: []
}

export const userGet = createAsyncThunk('user/get', async() => {
	var response = await axios.get(BASE, {
		headers: headers
	})
	return response.data
})
export const userGetId = createAsyncThunk('user/get/id', async() => {
	var response = await axios.get(BASE, {
		headers: headers
	})
	return response.data
})
export const userAdd = createAsyncThunk('user/add', async(body) => {
	var response = await axios({
		url: BASE,
		method: 'POST',
		data: body,
		headers: headers
	})
	return response.data
})
export const userUpdate = createAsyncThunk('user/update', async(body) => {
	var response = await axios({
		url: BASE + '/' + body[ID],
		method: 'PATCH',
		data: body,
		headers: headers
	})
	return Object.assign(response.data, {id: body[ID]})
})
export const userDelete = createAsyncThunk('user/delete', async(body) => {
	var response = await axios({
		url: BASE + '/' + body[ID],
		method: 'DELETE',
		headers: headers
	})
	return Object.assign(response.data, {id: body[ID]})
})

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		handle(state, action){
			state[action.payload.name] = action.payload.value
		}
	},
	extraReducers: {
    	[userGet.fulfilled]: (state, action) => {
    		state.data = action.payload
    	},
    	[userGetId.fulfilled]: (state, action) => {
    		// state.show = action.payload
    	},
    	[userAdd.fulfilled]: (state, action) => {
    		state.data.push(action.payload)
    	},
    	[userUpdate.fulfilled]: (state, action) => {
    		state.data = state.data.map(e => {
    			if(e[ID] === action.payload[ID]){
    				e = Object.assign(e, action.payload)
    			}
    			return e
    		})
    	},
    	[userDelete.fulfilled]: (state, action) => {
    		state.data = state.data.filter(e => e[ID] !== action.payload[ID])
    	},
  	},
})
export const {handle} = userSlice.actions

export default userSlice.reducer