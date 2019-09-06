import { define } from '../../../src'

export default define('posts', {}, {
  *fetchPosts(subreddit, force) {
    const data = this.$state[subreddit]
    if (data && data.isFetching === false && !data.didInvalidate && !force) return

    yield this.$set(subreddit, {
      isFetching: true,
      didInvalidate: false,
      items: [],
    })

    try {
      const json = yield fetch(`https://www.reddit.com/r/${subreddit}.json`).then(response =>
        response.json()
      )
      yield this.$set(subreddit, {
        isFetching: false,
        didInvalidate: false,
        items: json.data.children.map(child => child.data),
      })
    } catch (e) {
      console.log(e)
      yield this.$set(`${subreddit}.didInvalidate`, true)
    }
  },
})
