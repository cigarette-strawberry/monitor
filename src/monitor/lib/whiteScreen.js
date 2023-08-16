/*
 * @FileDescription: ***
 * @Author: 吴晨
 * @Date: 2023-08-15 11:24:57
 * @LastEditors: 吴晨
 * @LastEditTime: 2023-08-15 12:24:18
*/
import tracker from '../utils/tracker'
import onload from '../utils/onload'

export function whiteScreen() {
    let wrapperElements = ['html', 'body', '#container', '.content']
    let emptyPoints = 0

    function getSelector(element) {
        if (element.id) {
            return '#' + element.id
        } else if (element.className) {
            return '.' + element.className.split(' ').filter(item => !!item).join('.')
        } else {
            return element.nodeName.toLowerCase()
        }
    }

    function isWrapper(element) {
        let selector = getSelector(element)
        if (wrapperElements.indexOf(selector) !== -1) {
            emptyPoints++
        }
    }

    onload(function () {
        for (let i = 0; i <= 9; i++) {
            let xElements = document.elementsFromPoint(window.innerWidth * i / 10, window.innerHeight / 2)
            let yElements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight * i / 10)
            isWrapper(xElements[0])
            isWrapper(yElements[0])
        }

        if (emptyPoints > 0) {
            let centerElements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2)
            tracker.send({
                kind: 'stability',
                type: 'whiteScreen',
                emptyPoints,
                screen: window.screen.width + 'X' + window.screen.height,
                viewPoint: window.innerWidth + 'X' + window.innerHeight,
                selector: getSelector(centerElements[0])
            })
        }
    })

}
