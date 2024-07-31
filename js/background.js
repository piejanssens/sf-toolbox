// Listening for messages
chrome.runtime.onMessage.addListener(receiver)

function receiver(request, sender, sendResponse) {
  if (request.message === 'thank you') {
    // Not doing anything for messages received but I could!
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received: ', message)
  if (message.greeting === 'update-badge') {
    chrome.action.setBadgeText({
      text: message.proxyEnabled ? 'PRXY' : '',
    })
  }
  return true
})
