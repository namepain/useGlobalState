import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import useGlobalState, { createStore } from './useGlobalState'

createStore({
	count: 0,
	foo: 100,
	inc: state => ({ ...state, count: state.count + 1 }),
	dec: state => ({ ...state, count: state.count - 1 }),

	nest: {
		count: 1,
		nest: {
			count: 2,
			nestInc: state => ({ ...state, count: state.count + 2 }),
			nestDec: state => ({ ...state, count: state.count - 2 }),
		}
	}
})

function App () {
	const [{ count }, { inc, dec }] = useGlobalState()
	console.log('App render...')
	return <>
		current count is:
		<br/>
		{ count }
		<br/>
		<button onClick={inc}>inc</button>
		<button onClick={dec}>dec</button>
		<br/>
		click button to change state
		<br/><br/>
		<CompA />
		<br/><br/>
		<CompB />
	</>
}

const CompA = React.memo(function CompA () {
	// 虽然 foo 没变，但 foo 所在的层级有变量发生变化，还是会更新
	// 可以直接取到其他层级的 action 操作他们
	const [
		{ foo, nest: { nest: { count } } }, // bug 
		{ nest: { nest: { nestInc } } },
	] = useGlobalState()
	console.log('CompA render...')
	return (
		<>
			CompA:
			<br/>
			{ count }
			<br/>
			<button onClick={nestInc}>click me make CompB +2</button>
		</>
	)
})

const CompB = React.memo(function CompB () {
	const [{ count: countForTopLevel }] = useGlobalState()
	const [{ count }, { nestInc, nestDec }] = useGlobalState(state => state.nest.nest)
	console.log('CompB render...')
	return (
		<>
			CompB:
			<br/>
			count for top level: 
			&nbsp;&nbsp;
			{ countForTopLevel }
			<br/>
			count for nest:
			&nbsp;&nbsp;&nbsp;&nbsp;
			&nbsp;&nbsp;&nbsp;&nbsp;
			{ count }
			<br/>
			<button onClick={nestInc}>click me increase Two</button>
			<button onClick={nestDec}>click me decrease Two</button>
		</>
	)
})

ReactDOM.render(<App/>, document.getElementById('root'))