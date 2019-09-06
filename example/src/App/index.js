import React from 'react'
import { useMappedState } from 'redux-react-hook'
import Picker from './Picker'
import Posts from './Posts'

const mapState = state => {
  const { subreddit, posts } = state
  return { subreddit, data: posts[subreddit] }
}

export default () => {
  const { subreddit, data } = useMappedState(mapState)
  const { lastUpdated, items, isFetching } = data

  const handleChange = () => {}

  const handleRefreshClick = () => {}

  return (
    <div>
      <Picker value={subreddit} onChange={handleChange} options={['reactjs', 'frontend']} />
      <p>
        {lastUpdated && <span>Last updated at {new Date(lastUpdated).toLocaleTimeString()}. </span>}
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
