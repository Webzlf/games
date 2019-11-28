import axios from 'axios'
import qs from 'qs'
import {
  getToken
} from '&&/utils/auth'
/**
 * 日期格式化
 * @param {number} time 时间戳
 * @param {string} cFormat 格式化 默认样式：'{y}-{m}-{d} {h}:{i}:{s}'
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    // eslint-disable-next-line
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

/**
 * 时间格式化
 * @param {number} time 时间戳 （Date.now() / 1000 必须除以 1000）
 * @param {string} option 格式化 默认样式：'{y}-{m}-{d} {h}:{i}:{s}'
 */
export function formatTime (time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

// url参数对象化
export function getQueryObject (url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen (val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    // eslint-disable-next-line
    if (val[i].match(/[^\x00-\xff]/gi) != null) {
      len += 1
    } else {
      len += 0.5
    }
  }
  return Math.floor(len)
}

export function cleanArray (actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param (json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

export function param2Obj (url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') +
    '"}'
  )
}

export function html2Text (val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge (target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

export function toggleClass (element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [{
  text: '今天',
  onClick (picker) {
    const end = new Date()
    const start = new Date(new Date().toDateString())
    end.setTime(start.getTime())
    picker.$emit('pick', [start, end])
  }
},
{
  text: '昨天',
  onClick (picker) {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 24 * 3600 * 1000)
    end.setTime(end.getTime() - 24 * 3600 * 1000)
    picker.$emit('pick', [start, end])
  }
},
{
  text: '最近一周',
  onClick (picker) {
    const end = new Date(new Date().toDateString())
    const start = new Date()
    start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
    picker.$emit('pick', [start, end])
  }
},
{
  text: '最近一个月',
  onClick (picker) {
    const end = new Date(new Date().toDateString())
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    picker.$emit('pick', [start, end])
  }
}
]

export function getTime (type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function debounce (func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

// 深拷贝
export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
// 简单版深拷贝
export function simpleDeepCopy (obj) {
  if (!isObject(obj)) {
    return obj
  }
  let isArray = Array.isArray(obj)
  let cloneObj = isArray ? [] : {}
  let result = Object.keys(obj).map(key => {
    return {
      [key]: simpleDeepCopy(obj[key])
    }
  })
  return Object.assign(cloneObj, ...result)
}

// 判断是否为对象
export function isObject (o) {
  return (typeof o === 'object' || typeof o === 'function') && o !== null
}

// 数组去重
export function uniqueArr (arr) {
  return Array.from(new Set(arr))
}
// 外部网络
export function isExternal (path) {
  // return /^(https?:|mailto:|tel:)/.test(path)
  return /^(mailto:|tel:)/.test(path)
}

/**
 * 千位符格式化
 * @param {number} num 需要格式话的数值
 * @param {number} precision 保留n位小数
 * @param {string} separator 分隔符
 */
export function formatNumber (num, precision, separator) {
  let parts
  // 判断是否为数字
  if (!isNaN(parseFloat(num)) && isFinite(num)) {
    // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
    // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
    // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
    // 的值变成了 12312312.123456713
    num = Number(num)
    // 处理小数点位数
    num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString()
    // 分离数字的小数部分和整数部分
    parts = num.split('.')
    // 整数部分加[separator]分隔
    parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','))
    return parts.join('.')
  }
  return '0.00'
}

/**
 * 对象数组列表提取对象某个key的值组成新的数组
 * eg. [{name: 'jim', age: 8}, {name: 'tom', age: 9}] => ['jim', 'tom']
 */
export function mapObjArrVal (arr, objKey) {
  let tempArr = arr.map(item => {
    return item[objKey]
  })
  return tempArr
}

/**
 * 文件下载
 */
export function download (href, fileName = '', isTarget) {
  const domA = document.createElement('a')
  domA.href = href
  // 只有chrome和firefox才有download属性
  domA.download = fileName
  if (isTarget) domA.target = '_blank'
  domA.click()
}
/**
 * 把json格式对象转换成url参数， 不能是二维以上的对象
 */
export function objectToUrlParams (obj) {
  return Object.keys(obj).map(key => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
  }).join('&')
}

export function convertBase64UrlToFile (dataUrl, filename) {
  // 去掉url的头，并转换为byte
  var bytes = window.atob(dataUrl.split(',')[1])
  // 处理异常,将ascii码小于0的转换为大于0
  var mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0]
  var ab = new Uint8Array(bytes.length)
  for (var i = 0; i < bytes.length; i++) {
    ab[i] = bytes.charCodeAt(i)
  }
  return new File([ab], filename, {
    type: mimeString
  })
}

// 图片文件流获取请求
export function getBufferFile (url, data, method = 'GET') {
  if (method === 'GET') {
    return axios({
      url,
      method,
      headers: {
        token: getToken('PC_TOKEN') || ''
      },
      params: data,
      responseType: 'arraybuffer' // 必须是arraybuffer类型
    }).then(response => {
      return 'data:image/png;base64,' + btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
    })
  } else {
    return axios({
      url,
      method,
      headers: {
        token: getToken('PC_TOKEN') || ''
      },
      data: qs.stringify(data),
      responseType: 'arraybuffer' // 必须是arraybuffer类型
    }).then(response => {
      return 'data:image/png;base64,' + btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
    })
  }
}

/**
 * 文件流下载
 * @param {string} url 请求路径
 * @param {any} data 请求参数
 * @param {string} 请求方法(默认为get请求)
 * @param {string} paramsFormat 请求参数格式(默认为x-www-form-urlencoded格式)
 */
export function downloadBufferFile (url, data, method = 'GET', paramsFormat = 'x-www-form-urlencoded') {
  if (method === 'GET') {
    return axios({
      url,
      method,
      headers: {
        token: getToken('PC_TOKEN') || ''
      },
      params: data,
      responseType: 'blob' // 必须是arraybuffer类型
    }).then(response => {
      handleDownloadBufferFile(response)
    })
  } else {
    if (paramsFormat === 'x-www-form-urlencoded') {
      // 当传参格式为: 'x-www-form-urlencoded'
      return axios({
        url,
        method,
        headers: {
          token: getToken('PC_TOKEN') || ''
        },
        data: qs.stringify(data),
        responseType: 'blob' // 必须是arraybuffer类型
      }).then(response => {
        setTimeout(() => {
          handleDownloadBufferFile(response)
        }, 0)
      })
    }

    if (paramsFormat === 'json') {
      // 当传参格式为: 'json'
      return axios({
        url,
        method,
        headers: {
          token: getToken('PC_TOKEN') || ''
        },
        data,
        responseType: 'blob' // 必须是arraybuffer类型
      }).then(response => {
        setTimeout(() => {
          handleDownloadBufferFile(response)
        }, 0)
      })
    }
  }
}

function handleDownloadBufferFile (response) {
  let url = window.URL.createObjectURL(response.data) // 表示一个指定的file对象或Blob对象
  let fileName = '' // filename名称截取
  if ((response.headers['content-disposition'] && response.headers['content-disposition'].length) || (response.headers['Content-Disposition'] && response.headers['Content-Disposition'].length)) {
    fileName = (response.headers['content-disposition'] || response.headers['Content-Disposition']).split(';')[1].split('=')[1]
    let a = document.createElement('a')
    document.body.appendChild(a)
    a.href = url
    a.download = fileName // 命名下载名称
    a.click() // 点击触发下载
    window.URL.revokeObjectURL(url) // 下载完成进行释放
  }
}

export function getStore (modelName, key) {
  let obj = window.localStorage && window.localStorage.getItem(modelName + key)
  if (obj && obj !== 'undefined' && obj !== 'null') {
    return JSON.parse(obj)
  }
  return ''
}
export function setStore (modelName, key, val) {
  window.localStorage && window.localStorage.setItem(modelName + key, JSON.stringify(val))
}
export function removeStore (modelName, key) {
  if (modelName + key) {
    window.localStorage && window.localStorage.removeItem(modelName + key)
  } else {
    console.log(arguments)
    for (var i in arguments) {
      window.localStorage && window.localStorage.removeItem(arguments[i])
    }
  }
}

/**
 * @description 判断本地、开发、测试、正式环境
 * @author heyikun
 * @lastUpdate 2019-7-15 11:54:45
 * @returns { String } 返回字符串
 */
export function env () {
  const host = window.location.host
  // 本地环境
  if (process.env.NODE_ENV === 'development') return 'development'
  // 线上开发环境
  if (host.includes('.kf.')) return 'devBuild'
  // 测试环境
  if (host.includes('.cs.')) return 'test'
  // 线上环境
  return 'production'
}
