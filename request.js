import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
// import { Message } from 'element-ui'
import store from '&&/store'
import { getToken } from '&&/utils/auth'

// 创建axios实例
const service = axios.create({
  headers: {
    'content-type': 'application/json;charset=UTF-8'
  },
  withCredentials: false,
  // baseURL: process.env.API, // api 的 base_url
  timeout: 20000 // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['token'] = getToken('PC_TOKEN')
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
	 * 下面的注释为通过在response里，自定义code来标示请求状态
	 * 当code返回如下情况则说明权限有问题，登出并返回到登录页
	 * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
	 * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
	 */
  response => {
    const res = response.data
    if (res && (res.code === 0 || res.code === 119008 || res.code === 140008 || res.code === 140009 || res.code === 140011)) {
      return res.data
    } else {
      // OK(0, "成功"),
      // UNAUTHORIZED(140001, "登录认证失败"),
      // TOKEN_EXPRITE(140002, "无效登录授权Token"),
      // USERNAME_PASSWORD_ERROR(140003, "用户名或密码错误"),
      // UNAUTHORIZED_LOCK(140004, "用户已锁定"),
      // FORBIDDEN(140005, "没有权限"),
      // JCAPTCHA(140006, "验证码错误");
      if (res.code === 10001 || res.code === 140001 || res.code === 140002) {
        // 请自行在引入 MessageBox
        MessageBox.confirm(
          '由于您长时间没操作，登录信息已过期，请重新登录',
          '重新登录',
          {
            confirmButtonText: '重新登录',
            // cancelButtonText: '取消',
            type: 'warning',
            showClose: false,
            showCancelButton: false,
            closeOnClickModal: false, // 遮罩层点击不能关闭MessageBox
            beforeClose: (action, instance, done) => {
              // done()
              if (action === 'cancel') {
                // MessageBox.close()
                location.reload()
              } else {
                store.dispatch('FedLogOut').then(() => {
                  location.reload() // 为了重新实例化vue-router对象 避免bug
                  // this.$router.push({path: '/login'})
                })
              }
            }
          }
        ).catch(err => {
          console.log(err)
        })
        return false
      } else if (res.code === 1) {
        Message({
          message: res.msg,
          type: 'warning',
          duration: 5 * 1000
        })
        return Promise.reject(res.data || res.msg)
      } else {
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(res.data || res.msg)
      }
    }
  },
  error => {
    Message({
      message: error.msg || (error.response && error.response.data.msg) || '网络出错~~',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
