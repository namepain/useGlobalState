import { useState, useEffect } from "react"

// 1. 注册一个仓库 --> createStore
// 2. 能取这个仓库 --> useGlobalState

let store
const useGlobalState = namespace => {
	if (!store) throw new Error('巧妇难为无米之炊!!')

	const getter = () => typeof namespace === 'function'
		? [ namespace(store.__state), namespace(store.__actions) ]
		: [ store.__state, store.__actions ]
	const [s, a] = getter()
	const [val, set] = useState([ { ...s }, { ...a } ])
	
	useEffect(() => {
		const listener = () => {
			const newVal = getter()[0]
			if (!shalowEqual(newVal, listener.oldVal)) {
				set([{ ...newVal }, val[1]])
				listener.oldVal = { ...newVal }
			}
		}
		listener.oldVal = { ...val[0] }
		store.__listeners.push(listener)
		return () => {
			store.__listeners = store.__listeners.filter(l => l !== listener)
		}
	}, [])

	return [{ ...val[0] }, { ...val[1] }]
}


const createStore = s => {
	if (!isObject(s) || !Object.keys(s).length) {
		throw new Error('即使我不相亲, 也请给我个对象!!')
	}
	if (store) {
		throw new Error('花有重开日, 人无再少年!!')
	}
	
	store = { __state: {}, __actions: {}, __listeners: [] }
	transform(s, store.__state, store.__actions)

	function transform (obj, state, actions) {
		Object.keys(obj).forEach(key => {
			const property = obj[key]
			
			if (isObject(property)) { // nested
				state[key] = {}
				actions[key] = {}
				transform(property, state[key], actions[key])
			
			} else if (typeof property === 'function') { // actions
				actions[key] = () => {
					const newState = property(state)
					Object.keys(newState).forEach(k => state[k] = newState[k])
					store.__listeners.forEach(l => l())
				}
			} else {
				state[key] = property
			}
		})
	}
}

const isObject = v => v !== null && typeof v === 'object'
function shalowEqual (a, b) {
	return (!isObject(a) && a === b) ||
		(
			Object.keys(a).length === Object.keys(b).length &&
			Object.keys(a).every(k => a[k] === b[k])
		)
}

export default useGlobalState
export { createStore }