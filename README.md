# useGlobalState
> 一个极简的 react 状态管理库，基于 hooks，easy to use

- lightweight, less than 80 line code
- no concepts，just 2 API
- ~~no BB, just use it~~  Don't use it right now

## createStore

```javascript
import useGlobalState, { createStore } from './useGlobalState'

createStore({
	count: 0,
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
```
that's it, free to nest

## useGlobalState

```javascript
const CompB = React.memo(function CompB () {
	// widthout namespace, you got the whole state tree
	const { count: countForTopLevel } = useGlobalState()
	// with namespace function passed in, you got the neseted state
	// when properties in level 2 be modified, component will rerender
	const { count, nestInc, nestDec } = useGlobalState(state => state.nest.nest)
	// 
	return (
		<>
			CompB:
			<br/>
			count for top level: { countForTopLevel }
			<br/>
			count for nest: { count }
			<br/>
			<button onClick={nestInc}>click me increase Two</button>
			<button onClick={nestDec}>click me decrease Two</button>
		</>
	)
})
```

### note
As a library which support nested object, there are sevaral bugs when use nested state in component!!
果咩纳塞！！