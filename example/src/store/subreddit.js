import { define } from '../../../src'

export default define('subreddit', 'reactjs', {
  set: (state, subreddit) => {
    state.subreddit = subreddit
  },
})
