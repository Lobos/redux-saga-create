import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { call } from 'redux-saga/effects'

export default (reducers, options = {}) => {
  const sagaMiddleware = createSagaMiddleware()
  const mid = applyMiddleware(sagaMiddleware)

  // eslint-disable-next-line
  const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  const enhance = options.dev && compose ? compose(mid) : mid

  const extendTask = (ctx, fn) =>
    function*({ data }) {
      try {
        yield call([ctx, fn], ...data)
      } catch (e) {
        if (options.onError) options.onError(e)
        else throw e
      }
    }

  const store = createStore(() => {}, enhance)
  const ctx = { store, sagaMiddleware, reducer: {}, extendTask }
  const dispatchs = {}

  Object.keys(reducers).forEach(key => {
    dispatchs[key] = reducers[key](ctx)
  })

  store.replaceReducer(combineReducers(ctx.reducer))

  return { store, dispatchs }
}
