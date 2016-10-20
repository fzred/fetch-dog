import { merge } from '../util'

export default function (requestConfig) {
  // eslint-disable-next-line
  requestConfig.options = requestConfig.options || {}
  const request = merge({
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    options: {
      emulateHTTP: false,
      emulateJSON: false,
    },
    data: {},
  }, requestConfig)
  request.headers = new this.Headers(request.headers)

  return request
}
