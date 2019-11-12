function ajax(options) {
  function setData() {
    var map = {}

    if (typeof data === 'string') {
      data.split('&').forEach(function (item) {
        var tmp = item.split('=')
        map[tmp[0]] = tmp[1]
      })
    } else if (typeof data === 'object') {
      map = data
    }

    if (dataType === 'jsonp') {
      var timeName

      if (jsonpCache > 0) {
        timeName = parseInt(Date.now() / (jsonpCache * 1000 * 60))
      } else {
        timeName = Date.now() + Math.round(Math.random() * 1000)
      }

      callback = callback ? ['JSONP', callback, timeName].join('_') : ['JSONP', timeName].join('_')
      map['callback'] = callback
    }

    var arr = []
    for (var name in map) {
      var value = map[name] && map[name].toString() || ''
      name = encodeURIComponent(name)
      value = encodeURIComponent(value)
      arr.push(name + '=' + value)
    }
    map = arr.join('&').replace('/%20/g', '+')

    if (type === 'get' || dataType === 'jsonp') {
      url += url.indexOf('?') > -1 ? map : '?' + map
    }
  }

  // JSONP
  function createJsonp() {
    window[callback] = function (data) {
      clearTimeout(timeoutFlag)
      script.parentNode.removeChild(script)
      success(data)
    }

    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url

    setTime(callback, script)

    script.onerror = script.onreadystatechange = function () {
      if (!this.readyState || ((this.readyState === 'loaded' || this.readyState === 'complete') && !window[callback])) {
        delete window[callback]
        script.onload = script.onreadystatechange = null
        script.parentNode.removeChild(script)
        clearTimeout(timeoutFlag)
        error(new Error('ajax_load_error'))
      }
    }

    document.body.appendChild(script)
  }

  // 设置请求超时
  function setTime(callback, script) {
    if (timeOut !== undefined) {
      timeoutFlag = setTimeout(function () {
        if (dataType === 'jsonp') {
          delete window[callback]
          script.parentNode.removeChild(script)
          error(new Error('ajax_load_timeout'))
        } else {
          timeoutBool = true
          xhr && xhr.abort()
        }
        console.warn('timeout:: ', url)
      }, timeOut)
    }
  }

  function createXHR() {
    xhr = new XMLHttpRequest()
    xhr.open(type, url, async)
    if (type === 'post' && !contentType) {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencodedcharset=UTF-8')
    } else if (contentType) {
      xhr.setRequestHeader('Content-Type', contentType)
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (timeOut !== undefined) {
          if (timeoutBool) {
            return
          }
          clearTimeout(timeoutFlag)
        }

        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          success(xhr.responseText)
        } else {
          error(xhr.status, xhr.statusText)
        }
      }
    }

    xhr.send(type === 'get' ? null : data)
    setTime()
  }

  var url = options.url || ''
  var type = (options.type || 'get').toLowerCase()
  var data = options.data || null
  var callback = options.callback || null
  var contentType = options.contentType || ''
  var dataType = options.dataType || ''
  var async = options.async === undefined && true
  var timeOut = options.timeOut
  var before = options.before || function () {}
  var error = options.error || function () {}
  var success = options.success || function () {}
  var jsonpCache = parseInt(options.jsonpCache) || 0
  var timeoutBool = false
  var timeoutFlag = null
  var xhr = null

  setData()
  before()

  if (dataType === 'jsonp') {
    createJsonp()
  } else {
    createXHR()
  }
}

module.exports = ajax



// WEBPACK FOOTER //
// ./front/common/js/ajax.js