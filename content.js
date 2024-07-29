console.log('content loaded')

function injectScript(file, node) {
  var th = document.getElementsByTagName(node)[0]
  var s = document.createElement('script')
  s.setAttribute('type', 'text/javascript')
  s.setAttribute('src', file)
  th.appendChild(s)
}

injectScript(chrome.runtime.getURL('injected.js'), 'body')

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'get-page-data') {
    let pageHeaderData = document.body.getAttribute('data-sf-hdr')
    sendResponse({
      hostname: window.location.hostname,
      pageHeaderJsonData: pageHeaderData,
    })
  }
})
