import { queryParams } from '../url'
import { assign } from '../util'

export default function (requestConfig) {
  const request = assign({}, requestConfig)
  const { options } = request
  if (options.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(request.method)) {
    request.headers.set('X-HTTP-Method-Override', request.method)
    request.method = 'POST'
  }


  if (request.method === 'GET') {
    const param = queryParams(request.data)
    if (param.length > 0) {
      if (request.url.indexOf('?') > -1) {
        request.url += `&${param}`
      } else {
        request.url += `?${param}`
      }
    }
  } else if (options.emulateJSON) {
    request.body = queryParams(request.data)
    request.headers.set('Content-Type', 'application/x-www-form-urlencoded')
  } else {
    request.body = JSON.stringify(request.data)
  }

  return request
}
