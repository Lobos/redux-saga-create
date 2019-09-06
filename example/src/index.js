import React from 'react'
import ReactDOM from 'react-dom'
import { StoreContext } from 'redux-react-hook'
import { store } from './store'
import App from './App'

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.getElementById('root')
)
