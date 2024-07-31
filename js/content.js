console.log('content loaded')
let pageHeaderData = {}

function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0]
  var script = document.createElement('script')
  script.setAttribute('type', 'text/javascript')
  script.setAttribute('src', file_path)
  node.appendChild(script)
}
injectScript(chrome.runtime.getURL('js/injected.js'), 'body')

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'get-content-data') {
    sendResponse({
      hostname: window.location.hostname,
      pageHeaderData: pageHeaderData,
    })
  }
})

window.addEventListener(
  'message',
  (event) => {
    if (event.data.type && event.data.type === 'sf-header-json-data') {
      pageHeaderData = JSON.parse(event.data.text)
      chrome.runtime.sendMessage({
        greeting: 'update-badge',
        proxyEnabled: !!pageHeaderData.userInfo?.proxyId,
      })
    }
  },
  false
)
