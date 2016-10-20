export const isArray = Array.isArray

export function isString(val) {
  return typeof val === 'string'
}

export function isBoolean(val) {
  return val === true || val === false
}

export function isFunction(val) {
  return typeof val === 'function'
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

export function isPlainObject(obj) {
  return isObject(obj) && Object.getPrototypeOf(obj) === Object.prototype
}

export function when(value, fulfilled, rejected) {
  const promise = Promise.resolve(value)

  if (arguments.length < 2) {
    return promise
  }

  return promise.then(fulfilled, rejected)
}

export function each(obj, iterator) {
  if (obj && typeof obj.length === 'number') {
    for (let i = 0; i < obj.length; i += 1) {
      iterator.call(obj[i], obj[i], i)
    }
  } else if (isObject(obj)) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        iterator.call(obj[key], obj[key], key)
      }
    }
  }

  return obj
}

// eslint-disable-next-line no-underscore-dangle
function _merge(target, source, deep) {
  each(source, (value, key) => {
    if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
      if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
        // eslint-disable-next-line no-param-reassign
        target[key] = {}
      }
      if (isArray(source[key]) && !isArray(target[key])) {
        // eslint-disable-next-line no-param-reassign
        target[key] = []
      }
      _merge(target[key], source[key], deep)
    } else if (source[key] !== undefined) {
      // eslint-disable-next-line no-param-reassign
      target[key] = source[key]
    }
  })
}

export function merge(target, ...sources) {
  sources.forEach((source) => {
    _merge(target, source, true)
  })

  return target
}
