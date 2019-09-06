import immer from 'immer'
import { all, put, takeEvery } from 'redux-saga/effects'
import { deepMerge, deepSet, deepRemove } from './objects'
import { isString, isNumber, isObject, isGenerator, isFunc } from './is'

const toUpper = str =>
  str
    .replace(/\.?([A-Z]+)/g, (x, y) => `_${y}`)
    .replace(/^_/, '')
    .toUpperCase()

const setReducer = (state, action) => {
  const [key, value] = action.data

  // set object
  if (isObject(key)) return deepMerge(state, key)

  // whole value
  if (key === null || key === '') return value

  if (!isString(key) && !isNumber(key)) {
    throw new Error('setReducer arguments is invalid.')
  }

  return immer(state, draft => {
    deepSet(draft, `${key}`, value)
  })
}

const removeReducer = immer((state, { key }) => {
  if (!key) throw new Error('removeReducer key is required.')
  if (!isString(key)) throw new Error('removeReducer key is not valid. Expect a string.')
  deepRemove(state, key)
})

export default (name, defaultState, options = {}) => ({
  store,
  sagaMiddleware,
  reducer,
  extendTask,
}) => {
  const types = {}
  const actions = {}
  const dispatchs = {}
  const keys = Object.keys(options)
  const ctx = {
    types,
    actions: {},
    get state() {
      return store.getState()[name]
    },
    findState(n) {
      return store.getState()[n]
    },
  }

  const prefix = name.toUpperCase()
  const typePut = `${prefix}_$PUT`
  const typeSet = `${prefix}_$SET`
  const typeRemove = `${prefix}_$REMOVE`

  keys.forEach(key => {
    const type = `${prefix}_${toUpper(key)}`
    types[key] = type
    actions[key] = (...args) => ({ type, data: [...args] })
    dispatchs[key] = (...args) => store.dispatch({ type, data: [...args] })
    ctx.actions[key] = (...args) => put({ type, data: [...args] })
  })

  ctx.$put = func => put({ type: typePut, func })
  ctx.$set = (...data) => put({ type: typeSet, data })
  ctx.$remove = key => put({ type: typeRemove, key })

  const reducerTypes = keys.filter(k => isFunc(options[k]) && !isGenerator(options[k]))
  reducer[name] = (state = defaultState, action) => {
    if (action.type === typeSet) return setReducer(state, action)
    if (action.type === typeRemove) return removeReducer(state, action)
    if (action.type === typePut) return immer(state, action.func)

    for (const type of reducerTypes) {
      if (types[type] === action.type) {
        return immer(state, draft => options[type](draft, ...action.data))
      }
    }
    return state
  }

  sagaMiddleware.run(function*() {
    const sagas = yield all([
      // array type
      ...keys
        .filter(k => Array.isArray(options[k]))
        .map(k => {
          const [effect, fn] = options[k]
          return effect(types[k], extendTask(ctx, fn))
        }),
      // generator function
      ...keys
        .filter(k => isGenerator(options[k]))
        .map(k => takeEvery(types[k], extendTask(ctx, options[k]))),
    ])

    return sagas
  })

  dispatchs.$types = types
  dispatchs.$actions = actions

  dispatchs.$put = func => store.dispatch({ type: typePut, func })
  dispatchs.$set = function(...data) {
    // eslint-disable-next-line
    if (window.__DEBUG_MODE__) console.trace('set reducer')
    return store.dispatch({ type: typeSet, data })
  }
  dispatchs.$remove = key => store.dispatch({ type: typeRemove, key })

  return dispatchs
}
