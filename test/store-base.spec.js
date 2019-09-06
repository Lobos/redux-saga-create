import { createStore, define } from '../src/index'

const counter = define('counter', {}, {
  init: () => {
    return { count: 1 }
  },
  add: (state, count) => {
    state.count += count
  },
  sub: (state, count) => {
    state.count -= count
  },
  del: state => {
    delete state.count
  },
})

describe('store[counter]', () => {
  const { store, dispatchs } = createStore({ counter })
  const ca = dispatchs.counter

  test('init store and add count, sub count', () => {
    let state = store.getState()
    expect(state.counter.count).toBe(undefined)

    ca.init()
    state = store.getState()
    expect(state.counter.count).toBe(1)

    ca.add(2)
    state = store.getState()
    expect(state.counter.count).toBe(3)

    ca.sub(1)
    state = store.getState()
    expect(state.counter.count).toBe(2)

    ca.del()
    state = store.getState()
    expect(state.counter.count).toBe(undefined)

    expect(ca.$types).toEqual({
      init: 'COUNTER_INIT',
      add: 'COUNTER_ADD',
      sub: 'COUNTER_SUB',
      del: 'COUNTER_DEL',
    })
  })
})

describe('store[dispatchs]', () => {
  const { store, dispatchs } = createStore({ counter })
  const ca = dispatchs.counter

  test('init state by dispatchs', () => {
    let state = store.getState()
    expect(state.counter.count).toBe(undefined)

    store.dispatch(ca.$actions.init(1))
    state = store.getState()
    expect(state.counter.count).toBe(1)

    store.dispatch(ca.$actions.add(2))
    state = store.getState()
    expect(state.counter.count).toBe(3)

    store.dispatch(ca.$actions.sub(1))
    state = store.getState()
    expect(state.counter.count).toBe(2)
  })
})

describe('store[types]', () => {
  const { store, dispatchs } = createStore({ counter })
  const types = dispatchs.counter.$types

  test('init state by dispatchs', () => {
    let state = store.getState()
    expect(state.counter.count).toBe(undefined)

    store.dispatch({ type: types.init, data: [1] })
    state = store.getState()
    expect(state.counter.count).toBe(1)

    store.dispatch({ type: types.add, data: [2] })
    state = store.getState()
    expect(state.counter.count).toBe(3)

    store.dispatch({ type: types.sub, data: [1] })
    state = store.getState()
    expect(state.counter.count).toBe(2)
  })
})

const user = define('user', {}, {
  init: (state, name, age) => {
    state.name = name
    state.age = age
  },
  growUp: state => {
    state.age += 1
  },
  changeName: (state, name) => {
    state.name = name
  },
  error: () => {
    throw new Error('error')
  },
})

describe('store[user]', () => {
  const { store, dispatchs } = createStore({ user })
  const cu = dispatchs.user

  test('object test', () => {
    let state = store.getState()
    expect(state.user).toEqual({})

    cu.init('hello', 18)
    state = store.getState()
    expect(state.user).toEqual({ name: 'hello', age: 18 })

    cu.growUp()
    state = store.getState()
    expect(state.user.age).toBe(19)

    cu.changeName('world')
    state = store.getState()
    expect(state.user).toEqual({ name: 'world', age: 19 })
  })
})
