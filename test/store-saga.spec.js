import { takeLeading } from 'redux-saga/effects'
import { createStore, define } from '../src/index'
import { sleep } from './utils'

const init = () =>
  new Promise(resolve => {
    resolve(1)
  })

const counter = define('counter', {}, {
  *init() {
    const count = yield init()
    yield this.$set('count', count)
  },

  *put(count) {
    yield this.$put(state => {
      state.count = count
    })
  },

  *remove(key) {
    yield this.$remove(key)
  },

  *action(count) {
    yield this.put(count)
  },

  *selectState(cb) {
    yield sleep(1)
    cb(this.$state.count)
  },

  *getUser(cb) {
    yield sleep(1)
    cb(this.$findState('user').name)
  },

  *error() {
    yield sleep(1)
    throw new Error('error')
  },

  add: [
    takeLeading,
    function*() {
      yield sleep(10)
      yield this.$set('count', this.$state.count + 1)
    },
  ],
})

const user = define('user', { name: 'hello' })

describe('store[saga]', () => {
  const { store, dispatchs } = createStore({ counter, user })

  test('saga', async () => {
    dispatchs.counter.init()
    await sleep(1)
    expect(store.getState().counter.count).toBe(1)

    dispatchs.counter.put(1234)
    await sleep(1)
    expect(store.getState().counter.count).toBe(1234)

    dispatchs.counter.remove('count')
    await sleep(1)
    expect(store.getState().counter.count).toBe(undefined)

    dispatchs.counter.action(12)
    await sleep(1)
    expect(store.getState().counter.count).toBe(12)

    await (() =>
      new Promise(resolve => {
        dispatchs.counter.selectState(count => {
          expect(count).toBe(12)
          resolve()
        })
      }))()

    await (() =>
      new Promise(resolve => {
        dispatchs.counter.getUser(name => {
          expect(name).toBe('hello')
          resolve()
        })
      }))()

    dispatchs.counter.$set('count', 1)
    dispatchs.counter.add()
    dispatchs.counter.add()
    dispatchs.counter.add()
    dispatchs.counter.add()
    await sleep(20)
    expect(store.getState().counter.count).toBe(2)
  })
})

describe('store[error]', () => {
  let error
  const { dispatchs } = createStore(
    { counter },
    {
      onError: e => {
        error = e.message
      },
    }
  )

  test('object test', async () => {
    dispatchs.counter.error()
    await sleep(1)
    expect(error).toBe('error')
  })
})
