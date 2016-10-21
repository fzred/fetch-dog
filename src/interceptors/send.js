import { assign } from '../util'

export default function (requestConfig) {
  const request = assign({}, requestConfig)
  const { url, options } = request
  if (options.client) {
    // 自定义http请求handle
    return options.client(request)
  }

  delete request.data
  delete request.options
  delete request.url
  const fetch = this.fetch // 先保留变量，防止this指向问题
  return fetch(url, request)
}
