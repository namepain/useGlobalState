import { useState, useEffect } from "react"

// 1. 注册一个仓库 --> createStore
// 2. 能取这个仓库 --> useGlobalState
// 3. 能改这个仓库 --> actions

let _store, listeners = []
const useGlobalState = namespace => {
	if (!_store) {
		throw new Error('巧妇难为无米之炊!!')
	}
	const getter = () => typeof namespace === 'function'
		? [ namespace(_store.__state), namespace(_store.__actions) ]
		: [ _store.__state, _store.__actions ]
	const [val, set] = useState(getter())
	
	useEffect(() => {
		const listener = () => {
			const newVal = getter()[0]
			if (newVal !== val[0]) {
				set([newVal, val[1]])
			}
		}
		listeners.push(listener)
		return () => {
			listeners = listeners.filter(l => l !== listener)
		}
	}, [])

	return val
}


const createStore = s => {
	if (!s || typeof s !== 'object' || !Object.keys(s).length) {
		throw new Error('即使我不相亲，也请给我个对象!!')
	}
	if (_store) {
		throw new Error('人无再少年!!')
	}
	
	_store = { __state: {}, __actions: {} }
	transform(s, _store.__state, _store.__actions)

	function transform (obj, state, actions, prop = '') {
		Object.keys(obj).forEach(key => {
			const property = obj[key]
			// nested
			if (property && typeof property === 'object') {
				state[key] = {}
				actions[key] = {}
				transform(property, state[key], actions[key], prop ? `${prop}.${key}` : key)
			// actions
			} else if (typeof property === 'function') {
				actions[key] = () => {
					// const oldV = chain(_store, prop)
					const newState = property(state)
					Object.keys(newState).forEach(k => state[k] = newState[k])
					listeners.forEach(l => l())
				}
			} else {
				state[key] = property
			}
		})
	}
}

// function chain (obj, prop) {
// 	return prop.split('.').reduce((a, b) => a[b] || {}, obj)
// }

export default useGlobalState
export { createStore }