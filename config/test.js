const glob = require('glob')

function getEntriesBySync(path) {
  const entries = {}
  glob.sync(path).forEach(entry => {
    const temp = entry.split('/').splice(-2)
    entries[temp[0]] = ['eventsource-polyfill', entry]
  })
  return entries
}
console.log(getEntriesBySync('../src/*/main.js'))
