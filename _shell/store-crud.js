import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// CONFIG
const BASE = 'url'
const ID = 'id'
// you can choose fetch/axios/or more lib
const API = fetch
// setup your headers in here
const headers = {
	'Content-Type': 'application/json'
}
// if you want access token:
// const auth = () => JSON.parse(localStorage.getItem('auth')) || {}
const stringify = (data) => JSON.stringify(data)

var initialState = {
	name: 'caseName',
	data: []
}

export const caseNameGet = createAsyncThunk('caseName/get', async() => {
	var data = await API(BASE, {
		headers: headers
	})
	return await data.json()
})
export const caseNameGetId = createAsyncThunk('caseName/get/id', async() => {
	var data = await API(BASE, {
		headers: headers
	})
	return await data.json()
})
export const caseNameAdd = createAsyncThunk('caseName/add', async(body, thunkAPI) => {
	var data = await API(BASE, {
		method: 'POST',
		body: stringify(body),
		headers: headers
	})
	return await data.json()
})
export const caseNameUpdate = createAsyncThunk('caseName/update', async(body, thunkAPI) => {
	var data = await API(BASE + '/' + body[ID], {
		method: 'PATCH',
		body: stringify(body),
		headers: headers
	})
	var response = await data.json()
	return Object.assign(response, {id: body[ID]})
})
export const caseNameDelete = createAsyncThunk('caseName/delete', async(body, thunkAPI) => {
	var data = await API(BASE + '/' + body[ID], {
		method: 'DELETE',
		headers: headers
	})
	var response = await data.json()
	return Object.assign(response, {id: body[ID]})
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