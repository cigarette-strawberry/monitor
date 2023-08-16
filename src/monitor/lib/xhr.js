/*
 * @FileDescription: ***
 * @Author: 吴晨
 * @Date: 2023-08-14 20:44:55
 * @LastEditors: 吴晨
 * @LastEditTime: 2023-08-16 15:19:17
*/
import tracker from '../utils/tracker'

export function injectXHR() {
    let XMLHttpRequest = window.XMLHttpRequest
    let oldOpen = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function (method, url, async) {
        if (!url.match(/logstores/)) { // 上报接口 会造成死循环
            this.logData = {method, url, async}
        }
        return oldOpen.apply(this, arguments)
    }
    // axios 背后有两种  1、browser XMLHttpRequest
    //                  2、node http
    let oldSend = XMLHttpRequest.prototype.send
    XMLHttpRequest.prototype.send = function (body) {
        if (this.logData) {
            let startTime = Date.now() // 发送前，记录开始时间
            // XMLHttpRequest readyState 0 1 2 3 4
            // status 2xx 304 成功 其它就是失败
            let handler = (type) => (event) => {
                let duration = Date.now() - startTime
                let status = this.status // 200 500
                let statusText = this.statusText // ok Server Error
                tracker.send({
                    kind: 'stability',
                    type: 'xhr',
                    eventType: type, // load error abort
                    pathname: this.logData.url, // 请求路径
                    status: status + '-' + statusText, // 状态码
                    duration, // 持续时间
                    response: this.response ? JSON.stringify(this.response) : '', // 响应体
                    params: body || '',
                })
            }
            this.addEventListener('load', handler('load'), false)
            this.addEventListener('error', handler('error'), false)
            this.addEventListener('about', handler('about'), false)
        }
        return oldSend.apply(this, arguments)
    }
}
