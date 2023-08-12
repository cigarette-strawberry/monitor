/*
 * @FileDescription: ***
 * @Author: wu0304
 * @Date: 2023-07-30 19:41:40
 * @LastEditors: wu0304
 * @LastEditTime: 2023-08-05 22:40:08
 */
let host = 'cn-beijing.log.aliyuncs.com'
let project = 'monitor'
let logStore = 'monitor-store'
let userAgent = require('user-agent')
function getExtraData() {
  return {
    title: document.title,
    url: location.href,
    timestamp: Date.now(),
    userAgent: userAgent.parse(navigator.userAgent).name
  }
}

class SendExTracker {
  constructor() {
    this.url = `http://${project}.${host}/logstores/${logStore}/track` // 上报的路径
    this.xhr = new XMLHttpRequest()
  }
  send(data = {}) {
    let extraData = getExtraData()
    let log = { ...extraData, ...data }
    // 对象 的值不能是数字
    for (const key in log) {
      if (typeof log[key] === 'number') log[key] = `${log[key]}`
    }
    console.log(log)
    let body = JSON.stringify({
      __logs__: [log]
    })
    this.xhr.open('POST', this.url, true)
    this.xhr.setRequestHeader('Content-Type', 'application/json') // 请求体类型
    this.xhr.setRequestHeader('x-log-apiversion', '0.6.0') // 版本号
    this.xhr.setRequestHeader('x-log-bodyrawsize', body.length) // 请求体大小
    this.xhr.onload = function () {}
    this.xhr.onerror = function () {}
    this.xhr.send(body)
  }
}

export default new SendExTracker()
