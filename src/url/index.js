import { isArray, isPlainObject, isObject, isFunction, each } from '../util'

function serialize(params, obj, scope) {
  const array = isArray(obj)
  const plain = isPlainObject(obj)
  let hash

  each(obj, (value, key) => {
    hash = isObject(value) || isArray(value)

    if (scope) {
      // eslint-disable-next-line no-param-reassign
      key = `${scope}[${plain || hash ? key : ''}]`
    }

    if (!scope && array) {
      params.add(value.name, value.value)
    } else if (hash) {
      serialize(params, value, key)
    } else {
      params.add(key, value)
    }
  })
}

export function queryParams(obj) {
  const params = []
  const escape = encodeURIComponent

  params.add = (key, value) => {
    if (isFunction(value)) {
      // eslint-disable-next-line no-param-reassign
      value = value()
    }

    if (value === null) {
      // eslint-disable-next-line no-param-reassign
      value = ''
    }

    params.push(`${escape(key)}=${escape(value)}`)
  }

  serialize(params, obj)

  return params.join('&').replace(/%20/g, '+')
}

export function parse(url) {
}
