import React, { useEffect } from 'react'
import { useMappedState } from 'redux-react-hook'
import { dispatchs } from '../store'
import Picker from './Picker'
import Posts from './Posts'

const mapState = state => {
  const { subreddit, posts } = state
  return { subreddit, data: posts[subreddit] }
}

export default () => {
  const { subreddit, data } = useMappedState(mapState)
  const { lastUpdated, items = [], isFetching } = data || {}

  useEffect(() => {
    if (!data) dispatchs.posts.fetchPosts(subreddit)
  }, [subreddit])

  const handleChange = val => {
    dispatchs.subreddit.set(val)
  }

  const handleRefreshClick = () => {
    dispatchs.posts.fetchPosts(subreddit, true)
  }

  return (
    <div>
      <Picker value={subreddit} onChange={handleChange} options={['reactjs', 'frontend']} />
      <p>
        {lastUpdated && (
          <span>{`Last updated at ${new Date(lastUpdated).toLocaleTimeString()}.`}</span>
        )}
        {!isFetching && <button onClick={handleRefreshClick}>Refresh</button>}
      </p>
      {isFetching ? (
        <h2>Loading...</h2>
      ) : (
        <div style={{ opacity: isFetching ? 0.5 : 1 }}>
          <Posts posts={items} />
        </div>
      )}
    </div>
  )
}
