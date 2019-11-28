/**
 * reg: 校验规则
 * emptymsg: 无内容提示
 * errormsg: 校验提示
 * rule 校验规则
 * value 表单值
 * callback 回调
 */
let passwordValue
let modifyPassword

function common (rule, value, callback, reg, emptymsg, errormsg) {
  if (value === '' || value === undefined) {
    // defRequired 是自定义的属性，在表单必须填写但是label标签前面没有*（星号）
    if (rule.required || rule.defRequired) {
      callback(new Error(emptymsg))
    } else {
      callback()
    }
  } else if (reg.test(value)) {
    callback()
  } else {
    callback(new Error(errormsg))
  }
}

// 不验证
export function novalid (rule, value, callback) {
  const reg = /[\s\S]*/
  common(rule, value, callback, reg, '不能为空')
}
// 手机号
export function phone (rule, value, callback) {
  const reg = /^1[34578]\d{9}$/
  common(rule, value, callback, reg, '手机号不能为空', '输入的手机号格式错误')
}
// 固定电话
export function fixedLineTelephone (rule, value, callback) {
  /* eslint-disable*/
  const reg = /^(0\d{2,3}\-)?([2-9]\d{6,7})+(\-\d{1,6})?$/
  common(rule, value, callback, reg, '固定电话不能为空', '输入的固定电话格式错误')
}
// 邮箱
export function email (rule, value, callback) {
  const reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
  common(rule, value, callback, reg, '邮箱不能为空', '格式错误')
}
// 纯数字
export function number (rule, value, callback) {
  const reg = /^[0-9]+$/
  common(rule, value, callback, reg, '不能为空', '请输入数字格式')
}
// 支付数码
export function paynumber (rule, value, callback) {
  const reg = /^[0-9]{6}$/
  common(rule, value, callback, reg, '不能为空', '请输入6位数字支付密码')
}
// 纯字母
export function letter (rule, value, callback) {
  const reg = /[a-zA-Z]+/
  common(rule, value, callback, reg, '不能为空', '格式错误')
}
// 数字与字母
export function numletter (rule, value, callback) {
  const reg = /^[0-9A-Za-z]{6,20}$/
  common(rule, value, callback, reg, '不能为空', '格式错误')
}
// 密码
export function password (rule, value, callback) {
  passwordValue = value
  const reg = /^[0-9A-Za-z~!@#$%^&*]{6,16}$/
  common(rule, value, callback, reg, '不能为空', '格式错误')
}
// 再次密码确认
export function checkPassword (rule, value, callback) {
  const reg = new RegExp('^' + passwordValue + '$', 'g')
  common(rule, value, callback, reg, '不能为空', '两次密码不一致')
}
// 密码
export function modifyPassword (rule, value, callback) {
  modifyPassword = value
  const reg = /^[0-9]+$/
  common(rule, value, callback, reg, '不能为空', '请输入数字格式')
}
// 再次密码确认
export function checkModifyPassword (rule, value, callback) {
  const reg = new RegExp('^' + modifyPassword + '$', 'g')
  common(rule, value, callback, reg, '不能为空', '两次密码不一致')
}
// 图形验证码
export function pricture (rule, value, callback) {
  const reg = /^[0-9A-Za-z]{4,6}$/
  common(rule, value, callback, reg, '不能为空', '格式错误')
}
// 英文和中文和数字 [\u4e00-\u9fa5]
export function letterNumberWord (rule, value, callback) {
  const reg = /^[0-9A-Za-z\u4e00-\u9fa5]+$/
  common(rule, value, callback, reg, '不能为空', '格式错误')
}
export function area (rule, value, callback) {
  console.log(value, '\\\\\\\\')
  // const reg = /^[0-9A-Za-z\u4e00-\u9fa5]+$/
  // common(rule, value, callback, reg, '不能为空', '格式错误')
}
// 大于0的正整数
export function positiveInteger (rule, value, callback) {
  const reg = /^[0-9]*[1-9][0-9]*$/
  common(rule, value, callback, reg, '不能为空', '必须为大于0的正整数')
}
// 非负整数
export function nonnegativeInteger (rule, value, callback) {
  const reg = /^\d+$/
  common(rule, value, callback, reg, '不能为空', '请输入非负整数')
}
