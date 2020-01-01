import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import useGlobalState, { createStore } from './useGlobalState'

import CompA from './src/A.js'
import CompB from './src/B.js'

createStore({
	count: 0,
	inc: value => value + 1,
	dec: value => value - 1,
})

function App () {
	// const [count, setState] = useState(0)
	const { count, inc, dec } = useGlobalState()
	return <>
		current count is: { count }
		<br/>
		click button to change state
		<br/>
		<br/>
		<br/>
		<CompA />
		<br/>
		<br/>
		<br/>
		<CompB />
	</>
}

ReactDOM.render(<App/>, document.getElementById('root'))