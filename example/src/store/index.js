import { createStore } from '../../../src'
import posts from './posts'

export const { store, dispatchs } = createStore({ posts })
