import React, {
	useState, useEffect, useMemo, useCallback, useReducer
} from 'react'
import {
	useDispatch, useSelector
} from 'react-redux'
import {
	Link
} from 'react-router-dom'

export default function caseName() {
	const dispatch = useDispatch()
	return(
		<div>
			<p>this is caseName component</p>
		</div>
	)
}