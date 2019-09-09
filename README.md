# Redux saga create
一个简化使用 redux 和 saga 的辅助库，解决使用 redux 多个文件维护成本过高的问题。

合并 reducer, saga 为单个文件，并且隐藏 actions 和 types，使用时只调用函数即可。

## Requirements
本项目是在 redux-saga 上做的封装，使用 immer 作为 immutable 方案，所以依赖以下几个包。
```
immer >= 3.2.0
redux >= 4.0.0
redux-saga >= 1.0.0
```

## Installing
```
yarn add redux-saga-create
```

## Usage

```
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { StoreContext, useMappedState } from 'redux-react-hook'
import { define, createStore } = 'redux-saga-create'

// 定义一个 reducer 和 saga 混合的对象，type 和 action 会自动生成，不需要处理
const user = define('user', { status: 0 }, {
  // 普通函数，reducer
  setInfo: (state, info, status) => {
    // state 用 immer 封装过，可以直接设置值
    state.name = name
    state.status = status
  },

  // generator 函数，saga
  *login(name, pwd) => {
    // $set 是一个封装的设置 state 的快捷方式
    yield this.$set('status', 1)
    const user = yield fetchUser(name, pwd)
    // 这里可以直接调用 reducer 函数
    yield this.setInfo(user, 2)
  }
})

// 创建 store，返回 store 对象和 dispatchs 的集合
const { store, dispatchs } = createStore({ user })

// 这里用了 redux-react-hook，用 react-redux 也是一样的
const App = () => {
  const user = useMappedState(state => state.user)

  useEffect(() => {
    // 调用时直接调用定义的函数，不需要关心type和action
    if (user.status === 0) dispatchs.user.login('name', 'pwd')
  }, [])

  ...
}

ReactDOM.render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>,
  document.getElementById('root')
)

```

## API

### define(namespace:string, defaultState:any, funcs:object)
- namespace -- reducer 名称，不能重复
- defaultState -- state 默认值
- funcs -- 函数集合

### 普通函数 (state, ...args)
普通函数会作为 reducer 使用，用来处理 state
```
{
  // reducer 函数用immer包装过，可以直接赋值
  setInfo: (state, name, email) => {
    state.name = name
    state.email = email
  },
  // 有返回结果时，state 会被整个替换为返回结果
  setInfo2: (state, name, email) => {
    return { ...state, name, email }
  }
}

// 第一个参数 state 会自动注入，调用时不要传
user.setInfo(name, email)
```

### generator 函数
generator 函数会最为 redux-saga 函数使用
```
*login(name, pwd) => {
  let user = this.$state.user.info
  if (user) return

  yield this.$set('logging', true)
  user = yield fetchUser(name, pwd)
  yield this.$put(state => {
    // 这里可以直接对 state 赋值
    state.info = user
  })
  yield this.$remove('logging')
}
```
为了方便使用，generator 函数的 this 注入了 funcs 定义的函数和 一组快捷方式
- this.$set(path, value) -- 根据 key 赋值，path 支持 'a.b[0].c' 这种路径，如果子对象不存在，会自动创建
- this.$put(func) -- 通过函数修改 state 值
- this.$remove(path) -- 删除指定 path 数据
- this.$state -- 当前 state 数据
- this.$findState(name) -- 获取其他 reducer 下的 state

### effect
如果要使用 takLeading，tkeLatest 这样的 effect，可以传入数组来处理，数组第一个参数为effect，第二个参数为 generator 函数
```
{
  login: [
    takeLeading,
    function*(name, pwd) {
      ...
    }
  ]
}
```

### createStore(reducers:object, options:object?)
- reducers -- define 函数定义的对象集
- options -- 额外参数

```
createStore({ user }, {
  dev: bool // 是否支持 redux-devtool
  onError: func // 异常捕获
})
```