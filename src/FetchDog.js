/*
 http 请求库
 可用于浏览器，Node，RN
 */
import method from './interceptors/method'
import send from './interceptors/send'
import before from './interceptors/before'
import after from './interceptors/after'
import { when, assign } from './util'

export default class Rend {
  constructor(extraArgument) {
    assign(this, extraArgument)
    // this.fetch = fetch
    // this.Headers = Headers
    this.interceptors = {
      request: [],
      response: [],
    }
  }


  create(requestConfig) {
    let promise = when(requestConfig)
    promise = when(promise, before.bind(this))

    // 注册请求前拦截器
    this.interceptors.request.forEach(value => {
      promise = when(promise, value.bind(this))
    })

    promise = when(promise, method.bind(this))
    promise = when(promise, send.bind(this))

    // 注册请求后拦截器
    this.interceptors.response.forEach(value => {
      promise = when(promise, value.bind(this))
    })

    promise = when(promise, after.bind(this))

    return promise
  }

  get(url, data, options) {
    return this.create({
      method: 'GET',
      url,
      data,
      options,
    })
  }

  post(url, data, options) {
    return this.create({
      method: 'POST',
      url,
      data,
      options,
    })
  }

}
