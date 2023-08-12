/*
 * @FileDescription: ***
 * @Author: wu0304
 * @Date: 2023-07-29 21:54:52
 * @LastEditors: wu0304
 * @LastEditTime: 2023-07-29 22:51:56
 */
let lastEvent
;['click', 'touchstart', 'mousedown', 'keydown', 'mouseover'].forEach(eventType => {
  document.addEventListener(
    eventType,
    event => {
      lastEvent = event
    },
    {
      capture: true, // 捕获阶段
      passive: true // 默认不阻止默认事件
    }
  )
})

export default function () {
  return lastEvent
}
