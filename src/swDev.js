export default function swDev() {
    let swUrl = `/sw.js`
    navigator.serviceWorker.register(swUrl).then((res) => {
        console.log('res', res)
    })
}