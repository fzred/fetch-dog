export default function (requestConfig) {
  const request = Object.assign({}, requestConfig)
  const { url, options } = request
  if (options.client) {
    // 自定义http请求handle
    return options.client(request)
  }

  delete request.data
  delete request.options
  delete request.url
  return this.fetch(url, request)
}
