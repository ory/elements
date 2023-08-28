importScripts('https://cdn.jsdelivr.net/gh/golang/go@go1.21.0/misc/wasm/wasm_exec.js')
importScripts('https://cdn.jsdelivr.net/gh/nlepage/go-wasm-http-server@v1.1.0/sw.js')

addEventListener('install', event => {
  event.waitUntil(skipWaiting())
})

addEventListener('activate', event => {
  event.waitUntil(clients.claim())
})

addEventListener('message', () => { })

registerWasmHTTPListener('main.wasm', { base: 'api' })
