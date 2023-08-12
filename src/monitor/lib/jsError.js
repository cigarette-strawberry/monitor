/*
 * @FileDescription: ***
 * @Author: wu0304
 * @Date: 2023-07-16 21:21:09
 * @LastEditors: wu0304
 * @LastEditTime: 2023-08-05 22:20:41
 */
import getLastEvent from '../utils/getLastEvent'
import getSelector from '../utils/getSelector'
import tracker from '../utils/tracker'
export function injectJsError() {
  // 监听全局未捕获的错误
  window.addEventListener(
    'error',
    event => {
      // event 错误事件对象
      console.log('error', event)
      let lastEvent = getLastEvent() // 最后一个交互事件
      console.log(lastEvent)

      if (event.target && (event.target.src || event.target.href)) {
        // 这是一个脚本加载错误 资源加载前，必须先监听错误事件 或者你给script标签加上async或者defer 就能捕获到了
        const log = {
          kind: 'stability', // 监控指标的大类
          type: 'error', // 小类型 这是一个错误
          errorType: 'resourceError', // JS或CSS资源加载错误
          filename: event.target.src || event.target.href, // 哪个文件报错了
          tagName: event.target.tagName, // script
          selector: getSelector(event.target) // 代表最后一个操作的元素
        }
        console.log('资源加载错误', log)
        tracker.send(log)
      } else {
        const log = {
          kind: 'stability', // 监控指标的大类
          type: 'error', // 小类型 这是一个错误
          errorType: 'jsError', // JS执行报错
          message: event.message, // 报错信息
          filename: event.filename, // 哪个文件报错了
          position: `${event.lineno}:${event.colno}`,
          stack: getLines(event.error.stack),
          selector: lastEvent ? getSelector(lastEvent.composedPath()) : '' // 代表最后一个操作的元素
        }
        console.log('JS执行报错', log)
        tracker.send(log)
      }
    },
    true
  )

  window.addEventListener(
    'unhandledrejection',
    event => {
      console.log(event)
      let lastEvent = getLastEvent() // 最后一个交互事件
      console.log(lastEvent)
      let message,
        filename,
        lineno = 0,
        colno = 0,
        stack = '',
        reason = event.reason
      if (typeof reason === 'string') {
        message = reason
      } else if (typeof reason === 'object') {
        // 说明是一个错误对象
        if (reason.stack) {
          let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/)
          filename = matchResult[1]
          lineno = matchResult[2]
          colno = matchResult[3]
        }
        message = reason.message
        stack = getLines(reason.stack)
      }
      const log = {
        kind: 'stability', // 监控指标的大类
        type: 'error', // 小类型 这是一个错误
        errorType: 'promiseError', // promise执行报错
        message, // 报错信息
        filename, // 哪个文件报错了
        position: `${lineno}:${colno}`,
        stack,
        selector: getSelector(lastEvent.target) // 代表最后一个操作的元素
      }
      console.log('promise执行报错', log)
      tracker.send(log)
    },
    true
  )

  function getLines(stack) {
    return stack
      .split('\n')
      .splice(1)
      .map(item => item.replace(/^\s+at\s+/g, ''))
      .join('^')
  }
}
