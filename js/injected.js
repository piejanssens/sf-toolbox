let pageHeaderSeekerIteration = 0
const pageHeaderSeekerInterval = setInterval(() => {
  pageHeaderSeekerIteration++
  if (window.pageHeaderJsonData) {
    clearInterval(pageHeaderSeekerInterval)
    window.postMessage(
      {
        type: 'sf-header-json-data',
        text: JSON.stringify(window.pageHeaderJsonData),
      },
      '*'
    )
  }
  if (pageHeaderSeekerIteration == 100) {
    console.log(
      'No window.pageHeaderJsonData found after 10 seconds - aborting.'
    )
    clearInterval(pageHeaderSeekerInterval)
  }
}, 100)
