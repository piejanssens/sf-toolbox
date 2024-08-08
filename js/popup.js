;(async () => {
  document.addEventListener('DOMContentLoaded', async () => {
    const links = document.getElementsByTagName('a')
    for (var i = 0; i < links.length; i++) {
      const ln = links[i]
      ln.addEventListener('click', () => {
        chrome.tabs.create({ active: true, url: ln.href })
      })
    }

    //set version in footer
    document.getElementById('version').innerText =
      chrome.runtime.getManifest().version

    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    })

    let contentData
    try {
      contentData = await chrome.tabs.sendMessage(activeTab.id, {
        action: 'get-content-data',
      })
      document.getElementById('sfInfo').hidden = false
      document.getElementById('notSF').hidden = true
    } catch (error) {
      document.getElementById('notSF').hidden = false
      document.getElementById('sfInfo').hidden = true
      return
    }

    const fileResponse = await fetch(chrome.runtime.getURL('resources/dc.json'))
    const datacenters = await fileResponse.json()
    const hostname = contentData.hostname
    const pageHeaderData = contentData.pageHeaderData
    const resultCsdUrl = datacenters.find((x) => x.csd_hostname == hostname)
    const resultOldUrl = datacenters.find((x) => x.old_hostname == hostname)
    const dc = resultCsdUrl ? resultCsdUrl : resultOldUrl

    updateField('hostname', hostname)
    updateField('environment', dc?.environment)
    updateField(
      'datacenter',
      dc.datacenter ? dc.datacenter : 'Missing - Please report'
    )
    updateField('companyID', pageHeaderData.companyId)
    updateField('fullName', pageHeaderData.userInfo?.fullName)
    updateField('userID', pageHeaderData.userInfo?.id)
    updateField('personID', pageHeaderData.userInfo?.personId)
    updateField('assignmentUUID', pageHeaderData.userInfo?.assignmentUUID)
    updateField('proxyID', pageHeaderData.userInfo?.proxyId)
    updateField('api', dc?.api_hostname)
    updateField('region', dc?.region)
    updateField('provider', dc?.platform)

    document.getElementById('country').innerText = country2flag(dc.country)

    const inputs = document.querySelectorAll('button.btn')
    for (i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener('click', function (event) {
        let btn

        if (event.srcElement.tagName.toLowerCase() === 'button') {
          btn = event.srcElement
        }
        if (event.srcElement.tagName.toLowerCase() === 'div') {
          btn = event.srcElement.parentElement
        }

        const textEl = btn.children[0]
        const text = btn.getAttribute('data-original-value')
        navigator.clipboard.writeText(text)
        textEl.innerText = 'Copied'

        setTimeout(() => {
          textEl.innerText = text
        }, 1000)
      })
    }

    document
      .getElementById('provisioningButton')
      .addEventListener('click', () => {
        chrome.windows.create({
          url: `https://${dc.old_hostname ? dc.old_hostname : dc.csd_hostname}/provisioning_login`,
          incognito: true,
        })
      })
  })
})()

function updateField(fieldId, value) {
  document.getElementById(fieldId).innerText = value
  const btn = [...document.querySelectorAll('button.btn')].find((el) =>
    el.querySelector(`:scope > div[id="${fieldId}"]`)
  )
  btn.setAttribute('data-original-value', value)
}

function country2flag(countryCode) {
  return countryCode
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 0x1f1a5))
    .join('')
}
