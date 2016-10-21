# fetch-dog
基于 fetch 的 HTTP 请求客户端，支持node.js，浏览器，react-native

## 为什么需要 fetch-dog
支持node.js，浏览器，react-native多个环境，可用于同构（isomorphic）应用。
对fetch的API进行了轻度封装，加入拦截器（interceptor）支持。
极高扩展性，可把fetch替换为其他基于promise的HTTP请求客户端。


## 使用
### 添加polyfill
fetch 目前原生支持率并不高，不过引入 polyfill 后即可支持。
1. 浏览器端引入 [whatwg-fetch](https://github.com/github/fetch)
2. NodeJS引入 [node-fetch](https://github.com/bitinn/node-fetch)
3. react-native 对fetch有原生支持，不需要引入polyfill

### 安装
```bash
npm install fetch-dog
```
#### 浏览器
```javascript
import 'whatwg-fetch'
import FetchDog from 'fetch-dog'

const fd = new FetchDog({ fetch, Headers })
fd.get('/data/list', { id: 2 }).then(data => {
  console.log(data)
})
```

#### NodeJS

```javascript
import fetch, { Request, Headers, Response } from 'node-fetch'
import FetchDog from 'fetch-dog'

const fd = new FetchDog({ fetch, Headers })
fd.get('http://example.com/data/list', { id: 2 }).then(data => {
  console.log(data)
})
```

#### react-native
```javascript
import FetchDog from 'fetch-dog'

const fd = new FetchDog({ fetch, Headers })
fd.get('http://example.com/data/list', { id: 2 }).then(data => {
  console.log(data)
})
```


