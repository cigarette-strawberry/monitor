/*
 * @FileDescription: ***
 * @Author: 吴晨
 * @Date: 2023-08-15 12:14:30
 * @LastEditors: 吴晨
 * @LastEditTime: 2023-08-15 12:15:26
*/
export default function (callback) {
    if (document.readyState === 'complete') {
        callback()
    } else {
        window.addEventListener('load', callback)
    }
}
