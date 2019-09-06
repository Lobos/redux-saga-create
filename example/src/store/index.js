import { createStore } from '../../../src'
import posts from './posts'
import subreddit from './subreddit'

export const { store, dispatchs } = createStore({ posts, subreddit }, { dev: true })
