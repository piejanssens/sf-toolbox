;(async () => {
  let response = await fetch(chrome.runtime.getURL('dc.json'))
  const datacenters = await response.json()

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  })

  const data = await chrome.tabs.sendMessage(tab.id, {
    action: 'get-page-data',
  })

  const hostname = data.hostname

  let resultCsdUrl = datacenters.find((x) => x.csd_uri == hostname)
  let resultOldUrl = datacenters.find((x) => x.old_uri == hostname)
  const dc = resultCsdUrl ? resultCsdUrl : resultOldUrl

  document.getElementById('hostname').value = hostname
  document.getElementById('environment').value = dc.environment
  document.getElementById('datacenter').value = dc.datacenter
  document.getElementById('companyID').value =
    data.pageHeaderJsonData.companyId.companyId
})()
