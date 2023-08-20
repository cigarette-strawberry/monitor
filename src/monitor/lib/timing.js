/*
 * @FileDescription: ***
 * @Author: 吴晨
 * @Date: 2023-08-16 15:52:57
 * @LastEditors: 吴晨
 * @LastEditTime: 2023-08-17 10:50:30
*/
import tracker from '../utils/tracker'
import onload from '../utils/onload'
import getLastEvent from "../utils/getLastEvent";
import getSelector from "../utils/getSelector";

export function timing() {
    let FMP, LCP
    // 增加一个性能条目的观察者
    new PerformanceObserver((entryList, observer) => {
        let perfEntries = entryList.getEntries()
        FMP = perfEntries[0]
        observer.disconnect() // 不再观察了
    }).observe({entryTypes: ['element']}) // 观察页面中有意义的元素

    new PerformanceObserver((entryList, observer) => {
        let perfEntries = entryList.getEntries()
        LCP = perfEntries[0]
        observer.disconnect() // 不再观察了
    }).observe({entryTypes: ['largest-contentful-paint']}) // 观察页面中有意义的元素

    new PerformanceObserver((entryList, observer) => { // 用户的第一次交互 点击页面
        let lastEvent = getLastEvent()
        let firstInput = entryList.getEntries()[0]
        console.log('FID', firstInput)
        if (firstInput) {
            // processingStart 开始处理时间   startTime 开始点击的时间   差值就是处理的延迟
            let inputDelay = firstInput.processingStart - firstInput.startTime
            let duration = firstInput.duration // 处理的耗时
            if (inputDelay > 0 || duration > 0) {
                tracker.send({
                    kind: 'experience', // 用户体验指标
                    type: 'firstInputDelay', // 首次输入延迟
                    inputDelay, // 延迟的时间
                    duration, // 处理的时间
                    startTime: firstInput.startTime,
                    selector: lastEvent ? getSelector(lastEvent.path || lastEvent.target) : ''
                })
            }
        }
        observer.disconnect() // 不再观察了
    }).observe({type: 'first-input', buffered: true}) // 观察页面中有意义的元素

    onload(function () {
        setTimeout(_ => {
            // console.log('性能监控', performance.getEntriesByType('navigation'))
            const {
                fetchStart,
                connectStart,
                connectEnd,
                requestStart,
                responseStart,
                responseEnd,
                domInteractive,
                domContentLoadedEventStart,
                domContentLoadedEventEnd,
                loadEventStart
            } = performance.getEntriesByType('navigation')[0]
            tracker.send({
                kind: 'experience', // 用户体验指标
                type: 'timing', // 统计每个阶段的时间
                connectTime: connectEnd - connectStart, // 连接时间
                ttfbTime: responseStart - requestStart, // 首字节到达时间
                responseTime: responseEnd - responseStart, // 响应的读取时间
                // parseDOMTime:loadEventStart-
                domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart,
                timeToInteractive: domInteractive - fetchStart, // 首次可交互时间
                loadTime: loadEventStart - fetchStart // 完整的加载时间
            })

            let FP = performance.getEntriesByName('first-paint')[0]
            let FCP = performance.getEntriesByName('first-contentful-paint')[0]
            // 开始发送性能指标
            console.log('FP', FP)
            console.log('FCP', FCP)
            console.log('FMP', FMP)
            console.log('LCP', LCP)

        }, 3000)
    })
}
