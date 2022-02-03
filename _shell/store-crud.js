import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// you can choose fetch/axios/or more lib
const API = fetch
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
	var data = await API('url', {
		headers: headers
	})
	return await data.json()
})
export const caseNameAdd = createAsyncThunk('caseName/add', async(body, thunkAPI) => {
	var data = await API('url', {
		method: 'POST',
		body: stringify(body),
		headers: headers
	})
	return await data.json()
})
export const caseNameUpdate = createAsyncThunk('caseName/update', async(body, thunkAPI) => {
	var data = await API('url/' + body.id, {
		method: 'PATCH',
		body: stringify(body),
		headers: headers
	})
	return await data.json()
})
export const caseNameDelete = createAsyncThunk('caseName/delete', async(body, thunkAPI) => {
	var data = await API('url/' + body.id, {
		method: 'DELETE',
		headers: headers
	})
	return await data.json()
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
    	[caseNameAdd.fulfilled]: (state, action) => {
    		state.data.push(action.payload)
    	},
    	[caseNameUpdate.fulfilled]: (state, action) => {
    		state.data = state.data.map(e => {
    			if(e.id === action.payload.id){
    				e = action.payload.data
    			}
    			return e
    		})
    	},
    	[caseNameDelete.fulfilled]: (state, action) => {
    		state.data.filter(e => e.id !== action.payload.id)
    	},
  	},
})
export const {handle} = caseNameSlice.actions

export default caseNameSlice.reducer