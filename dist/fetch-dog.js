/**
 * fetch-dog v0.1.2
 * (c) 2016 方增鸿
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.FetchDog = factory());
}(this, (function () { 'use strict';

var isArray = Array.isArray;





function isFunction(val) {
  return typeof val === 'function'
}

function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

function isPlainObject(obj) {
  return isObject(obj) && Object.getPrototypeOf(obj) === Object.prototype
}

function when(value, fulfilled, rejected) {
  var promise = Promise.resolve(value);

  if (arguments.length < 2) {
    return promise
  }

  return promise.then(fulfilled, rejected)
}

function each(obj, iterator) {
  if (obj && typeof obj.length === 'number') {
    for (var i = 0; i < obj.length; i += 1) {
      iterator.call(obj[i], obj[i], i);
    }
  } else if (isObject(obj)) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        iterator.call(obj[key], obj[key], key);
      }
    }
  }

  return obj
}

// eslint-disable-next-line no-underscore-dangle
function _merge(target, source, deep) {
  each(source, function (value, key) {
    if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
      if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
        // eslint-disable-next-line no-param-reassign
        target[key] = {};
      }
      if (isArray(source[key]) && !isArray(target[key])) {
        // eslint-disable-next-line no-param-reassign
        target[key] = [];
      }
      _merge(target[key], source[key], deep);
    } else if (source[key] !== undefined) {
      // eslint-disable-next-line no-param-reassign
      target[key] = source[key];
    }
  });
}

function merge(target) {
  var sources = [], len = arguments.length - 1;
  while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

  sources.forEach(function (source) {
    _merge(target, source, true);
  });

  return target
}

function serialize(params, obj, scope) {
  var array = isArray(obj);
  var plain = isPlainObject(obj);
  var hash;

  each(obj, function (value, key) {
    hash = isObject(value) || isArray(value);

    if (scope) {
      // eslint-disable-next-line no-param-reassign
      key = scope + "[" + (plain || hash ? key : '') + "]";
    }

    if (!scope && array) {
      params.add(value.name, value.value);
    } else if (hash) {
      serialize(params, value, key);
    } else {
      params.add(key, value);
    }
  });
}

function queryParams(obj) {
  var params = [];
  var escape = encodeURIComponent;

  params.add = function (key, value) {
    if (isFunction(value)) {
      // eslint-disable-next-line no-param-reassign
      value = value();
    }

    if (value === null) {
      // eslint-disable-next-line no-param-reassign
      value = '';
    }

    params.push(((escape(key)) + "=" + (escape(value))));
  };

  serialize(params, obj);

  return params.join('&').replace(/%20/g, '+')
}

var method = function (requestConfig) {
  var request = Object.assign({}, requestConfig);
  var options = request.options;
  if (options.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(request.method)) {
    request.headers.set('X-HTTP-Method-Override', request.method);
    request.method = 'POST';
  }


  if (request.method === 'GET') {
    var param = queryParams(request.data);
    if (param.length > 0) {
      if (request.url.indexOf('?') > -1) {
        request.url += "&" + param;
      } else {
        request.url += "?" + param;
      }
    }
  } else if (options.emulateJSON) {
    request.body = queryParams(request.data);
    request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
  } else {
    request.body = JSON.stringify(request.data);
  }

  return request
};

var send = function (requestConfig) {
  var request = Object.assign({}, requestConfig);
  var url = request.url;
  var options = request.options;
  if (options.client) {
    // 自定义http请求handle
    return options.client(request)
  }

  delete request.data;
  delete request.options;
  delete request.url;
  var fetch = this.fetch; // 先保留变量，防止this指向问题
  return fetch(url, request)
};

var before = function (requestConfig) {
  // eslint-disable-next-line
  requestConfig.options = requestConfig.options || {};
  var request = merge({
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
  }, requestConfig);
  request.headers = new this.Headers(request.headers);

  return request
};

var after = function (res) {
  try {
    return res.json()
  } catch (e) {
    return res
  }
};

/*
 http 请求库
 可用于浏览器，Node，RN
 */
var Rend = function Rend(extraArgument) {
  Object.assign(this, extraArgument);
  // this.fetch = fetch
  // this.Headers = Headers
  this.interceptors = {
    request: [],
    response: [],
  };
};


Rend.prototype.create = function create (requestConfig) {
    var this$1 = this;

  var promise = when(requestConfig);
  promise = when(promise, before.bind(this));

  // 注册请求前拦截器
  this.interceptors.request.forEach(function (value) {
    promise = when(promise, value.bind(this$1));
  });

  promise = when(promise, method.bind(this));
  promise = when(promise, send.bind(this));

  // 注册请求后拦截器
  this.interceptors.response.forEach(function (value) {
    promise = when(promise, value.bind(this$1));
  });

  promise = when(promise, after.bind(this));

  return promise
};

Rend.prototype.get = function get (url, data, options) {
  return this.create({
    method: 'GET',
    url: url,
    data: data,
    options: options,
  })
};

Rend.prototype.post = function post (url, data, options) {
  return this.create({
    method: 'POST',
    url: url,
    data: data,
    options: options,
  })
};

return Rend;

})));
