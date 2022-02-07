import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
// CONFIG
const BASE = 'BASEURL'
const ID = 'id'
// setup your headers in here
const headers = {
	'Content-Type': 'application/json'
}
const stringify = (data) => JSON.stringify(data)

var initialState = {
	name: 'caseName',
	data: []
}

export const caseNameGet = createAsyncThunk('caseName/get', async() => {
	var response = await axios.get(BASE, {
		headers: headers
	})
	return response.data
})
export const caseNameGetId = createAsyncThunk('caseName/get/id', async() => {
	var response = await axios.get(BASE, {
		headers: headers
	})
	return response.data
})
export const caseNameAdd = createAsyncThunk('caseName/add', async(body) => {
	var response = await axios({
		url: BASE,
		method: 'POST',
		data: body,
		headers: headers
	})
	return response.data
})
export const caseNameUpdate = createAsyncThunk('caseName/update', async(body) => {
	var response = await axios({
		url: BASE + '/' + body[ID],
		method: 'PATCH',
		data: body,
		headers: headers
	})
	return Object.assign(response.data, {id: body[ID]})
})
export const caseNameDelete = createAsyncThunk('caseName/delete', async(body) => {
	var response = await axios({
		url: BASE + '/' + body[ID],
		method: 'DELETE',
		headers: headers
	})
	return Object.assign(response.data, {id: body[ID]})
})

export const caseNameSlice = createSlice({
	name: 'caseName',
	initialState,
	reducers: {
		handle(state, action){
			state[action.payload.name] = action.payload.value
		}
	},
	extraReducers: {
    	[caseNameGet.fulfilled]: (state, action) => {
    		state.data = action.payload
    	},
    	[caseNameGetId.fulfilled]: (state, action) => {
    		// state.show = action.payload
    	},
    	[caseNameAdd.fulfilled]: (state, action) => {
    		state.data.push(action.payload)
    	},
    	[caseNameUpdate.fulfilled]: (state, action) => {
    		state.data = state.data.map(e => {
    			if(e[ID] === action.payload[ID]){
    				e = Object.assign(e, action.payload)
    			}
    			return e
    		})
    	},
    	[caseNameDelete.fulfilled]: (state, action) => {
    		state.data = state.data.filter(e => e[ID] !== action.payload[ID])
    	},
  	},
})
export const {handle} = caseNameSlice.actions

export default caseNameSlice.reducer