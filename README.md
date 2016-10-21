# fetch-dog
基于 fetch 的 HTTP 请求客户端，支持node.js，浏览器，react-native

## 特点
* 支持node.js，浏览器，react-native多个环境，可用于同构（isomorphic）应用
* 支持拦截器（interceptor）
* 支持 Promise API 
* 支持 Firefox, Chrome, Safari, Opera and IE9+
* 高扩展性
* 轻量，只有5KB(gzip后 ~3KB)

# 使用
## 添加polyfill
fetch 目前原生支持率并不高，不过引入 polyfill 后即可支持。


1. 浏览器端引入 [whatwg-fetch](https://github.com/github/fetch)
2. NodeJS引入 [node-fetch](https://github.com/bitinn/node-fetch)
3. react-native 对fetch有原生支持，不需要引入polyfill

## 安装
```bash
npm install fetch-dog
```

## 示例
### 浏览器
```javascript
import 'whatwg-fetch'
import FetchDog from 'fetch-dog'

const fd = new FetchDog({ fetch, Headers })
fd.get('/data/list', { id: 2 }).then(data => {
  console.log(data)
})
```

### NodeJS

```javascript
import fetch, { Request, Headers, Response } from 'node-fetch'
import FetchDog from 'fetch-dog'

const fd = new FetchDog({ fetch, Headers })
fd.get('http://example.com/data/list', { id: 2 }).then(data => {
  console.log(data)
})
```

### react-native
```javascript
import FetchDog from 'fetch-dog'

const fd = new FetchDog({ fetch, Headers })
fd.get('http://example.com/data/list', { id: 2 }).then(data => {
  console.log(data)
})
```

# 文档
## 拦截器
```javascript
// 请求前拦截
fd.request.push(req => {
  req.headers.set('Custom-Header', 'hello')
  return req
})

// 请求后拦截
fd.response.push(res => {
  if (res.ok) {
    return res
  }
  return {
    code: -1,
    status: res.status,
    desc: `server err【${res.status}】`,
    data: null,
  }
})
```
