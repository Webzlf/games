import axios from 'axios'
import qs from 'qs'
import { auth } from 'poros/utils'

const { getToken } = auth

/**
 * 文件流下载
 * @param {string} url 请求路径
 * @param {any} data 请求参数
 * @param {string} 请求方法(默认为get请求)
 * @param {string} paramsFormat 请求参数格式(默认为x-www-form-urlencoded格式)
 */
export function downloadBufferFile (url, data, method = 'GET', paramsFormat = 'x-www-form-urlencoded') {
  console.log(url, data, method, paramsFormat)
  if (method === 'GET') {
    return axios({
      url,
      method,
      headers: { 'Authorization': getToken() },
      params: data,
      responseType: 'blob' // 必须是arraybuffer类型
    }).then(response => {
      handleDownloadBufferFile(response, data.name)
    })
  } else {
    if (paramsFormat === 'x-www-form-urlencoded') {
      // 当传参格式为: 'x-www-form-urlencoded'
      return axios({
        method: method,
        url: url, // 请求地址
        headers: { 'Authorization': getToken() },
        data: qs.stringify(data),
        responseType: 'blob' // 表明返回服务器返回的数据类型
      }).then(response => {
        setTimeout(() => {
          handleDownloadBufferFile(response, data.name)
        }, 0)
      })
    }

    if (paramsFormat === 'json') {
      // 当传参格式为: 'json'
      return axios({
        url,
        method,
        headers: { 'Authorization': getToken() },
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

function handleDownloadBufferFile (response, data) {
  if (response.data.type === 'application/json') {
    const reader = new FileReader()
    // 处理load事件。该事件在读取操作完成时触发
    reader.onload = e => {
      const res = JSON.parse(e.target.result)
      this.$message.error({
        content: res.msg
      }) // 异常信息抛出
    }
    reader.readAsText(response.data)
  } else {
    let url = window.URL.createObjectURL(response.data) // 表示一个指定的file对象或Blob对象
    let fileName = '' // filename名称截取
    if ((response.headers['content-disposition'] && response.headers['content-disposition'].length) || (response.headers['Content-Disposition'] && response.headers['Content-Disposition'].length)) {
      // let name = decodeURI((response.headers['content-disposition'] || response.headers['Content-Disposition']).split(';')[1].split('=')[1]) || (response.headers['content-disposition'] || response.headers['Content-Disposition']).split(';')[1].split('=')[1]
      fileName = data
      // 兼容ie
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(response.data, fileName)
        return false
      } else {
        let a = document.createElement('a')
        document.body.appendChild(a)
        a.href = url
        a.download = fileName // 命名下载名称
        a.click() // 点击触发下载
        window.URL.revokeObjectURL(url) // 下载完成进行释放
      }
    } else {
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(response, 'xxx.zip')
        return false
      } else {
        let a = document.createElement('a')
        document.body.appendChild(a)
        a.href = url
        a.download = data || '平台商品列表' // 命名下载名称
        a.click() // 点击触发下载
        window.URL.revokeObjectURL(url) // 下载完成进行释放
      }
    }
  }
}
