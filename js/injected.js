console.log(window.pageHeaderJsonData)
let j = 0
const i = setInterval(() => {
  j++
  if (window.pageHeaderJsonData) {
    clearInterval(i)
    window.postMessage(
      {
        type: 'sf-header-json-data',
        text: JSON.stringify(window.pageHeaderJsonData),
      },
      '*'
    )
  }
  if (j == 100) {
    console.log(
      'No window.pageHeaderJsonData found after 10 seconds - aborting.'
    )
    clearInterval(i)
  }
}, 100)
