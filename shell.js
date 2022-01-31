const fs = require('fs')
const prompt = require("prompt-sync")({ sigint: true });

const createDir = (root, input, fixName) => {
	var dir = prompt(`Directory file (root folder: /src/${root}) *optional : `);
	if(dir){
		dir = `${root}/${dir}/`
		if (!fs.existsSync('./src/' + dir)){
		    fs.mkdirSync('./src/' + dir, { recursive: true });
		}
		input.name = dir + fixName
	}else{
		input.name = `${root}/` + fixName
	}
}
const createCrud = (caseName, input) => {
	var crud = prompt(`Create CRUD using createAsyncThunk (y/n) : `);
	if(crud === 'y'){
		var url = prompt(`Base url (http://localhost:8000/api/user) : `);
		url = url || 'http://localhost:8000/api/user'
		input.code = `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// setup your headers in here
const headers = {}

var initialState = {
	name: '${caseName}',
	data: []
}

export const ${caseName}Get = createAsyncThunk('${caseName}/get', async() => {
	var data = await fetch('${url}', {
		headers: headers
	})
	return await data.json()
})
export const ${caseName}Add = createAsyncThunk('${caseName}/add', async(body, thunkAPI) => {
	var data = await fetch('${url}', {
		method: 'POST',
		body: body,
		headers: headers
	})
	return await data.json()
})
export const ${caseName}Update = createAsyncThunk('${caseName}/update', async(body, thunkAPI) => {
	var data = await fetch('${url}/' + body.id, {
		method: 'PATCH',
		body: body,
		headers: headers
	})
	return await data.json()
})
export const ${caseName}Delete = createAsyncThunk('${caseName}/delete', async(body, thunkAPI) => {
	var data = await fetch('${url}/' + body.id, {
		method: 'DELETE',
		headers: headers
	})
	return await data.json()
})

export const ${caseName}Slice = createSlice({
	name: '${caseName}',
	initialState,
	reducers: {
		handle(state, action){
			state[action.payload.name] = action.payload.value
		}
	},
	extraReducers: {
    	[${caseName}Get.fulfilled]: (state, action) => {
    		state.data = action.payload
    	},
    	[${caseName}Add.fulfilled]: (state, action) => {
    		state.data.push(action.payload)
    	},
    	[${caseName}Update.fulfilled]: (state, action) => {
    		state.data.map(e => {
    			if(e.id === action.payload.id){
    				e = action.payload.data
    			}
    			return e
    		})
    	},
    	[${caseName}Delete.fulfilled]: (state, action) => {
    		state.data.filter(e => e.id !== action.payload.id)
    	},
  	},
})
export const {} = ${caseName}Slice.actions

export default ${caseName}Slice.reducer
`
		return new Promise((res) => res(true))
	}
}

const run = async () => {
	console.log('List :');
	['create component', 'create route pages', 'create store'].map((data, key) => {
		console.log( `(${key})` , data)
	})
	const choose = prompt("Choose one : ");
	const name = prompt("Name file : ");

	const input = {
		name,
		code: ''
	}
	var caseName = String(name)[0].toUpperCase() + name.slice(1, name.indexOf('.'))
	var fixName = String(name)[0].toUpperCase() + name.slice(1)
	// component
	if(Number(choose) === 0){
		createDir('component', input, fixName)
		input.code = `import React from 'react'
import {
	useDispatch, useSelector
} from 'react-redux'

export default function ${caseName}() {
	const dispatch = useDispatch()
	return(
		<div>
			<p>this is ${caseName} component</p>
		</div>
	)
}`
	}
	// route
	if(Number(choose) === 1){
		createDir('route', input, fixName)
		input.code = `import React from 'react'
import {
	useDispatch, useSelector
} from 'react-redux'
import {
	useNavigate
} from 'react-router-dom'

export default function ${caseName}() {
	const to = useNavigate()
	const dispatch = useDispatch()
	// const app = useSelector(state => state.app)
	return(
		<div>
			<p>this is ${caseName} page</p>
		</div>
	)
}`
	}
	// store
	if(Number(choose) === 2){
		var caseName = String(name)[0].toLowerCase() + name.slice(1, name.indexOf('.'))
		var fixName = String(name)[0].toLowerCase() + name.slice(1)
		createDir('store', input, fixName)
		var isCrud = await createCrud(caseName, input)
		if(!isCrud){
		input.code = `import { createSlice } from '@reduxjs/toolkit'

var initialState = {
	name: '${input.name}'
}

export const ${caseName}Slice = createSlice({
	name: '${input.name}',
	initialState,
	reducers: {
		handle(state, action){
			state[action.payload.name] = action.payload.value
		}
	},
	extraReducers: {},
})
export const {handle} = ${caseName}Slice.actions

export default ${caseName}Slice.reducer`	
		}
	}

	fs.writeFile('./src/' + input.name, input.code, err => {
	  if (err) {
	    console.error(err)
	    return
	  }
	  console.log('create successfuly')
	  const choose = prompt("Run again (y/n) : ");
	  if(choose == 'y'){
	  	run()
	  }
	})
}

run()