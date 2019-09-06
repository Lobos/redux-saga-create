import { createStore, define } from '../src/index'

const counter = define('counter', {})

describe('store[shortcut]', () => {
  const { store, dispatchs } = createStore({ counter })
  const ca = dispatchs.counter

  test('init store and add count, sub count', () => {
    let state = store.getState()
    expect(state.counter.count).toBe(undefined)

    ca.$set('count', 1)
    state = store.getState()
    expect(state.counter.count).toBe(1)

    ca.$set('count', 2)
    state = store.getState()
    expect(state.counter.count).toBe(2)

    ca.$put(draft => {
      draft.count = 3
      draft.user = { name: 'hello', age: 18 }
    })
    state = store.getState()
    expect(state.counter).toEqual({ count: 3, user: { name: 'hello', age: 18 } })

    ca.$set('user.age', 19)
    state = store.getState()
    expect(state.counter.user.age).toBe(19)

    ca.$set('user.friends[1]', 'mike')
    state = store.getState()
    expect(state.counter.user.friends[1]).toBe('mike')

    ca.$remove('count')
    state = store.getState()
    expect(state.counter.count).toBe(undefined)
  })
})
