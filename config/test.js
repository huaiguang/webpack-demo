
const glob = require('glob');

function getEntries(path) {
  const entries = {}
  console.log('path: ' + path);
  glob.sync(path).forEach(entry => {
    console.log(2, entry)
    const temp = entry.split('/').splice(-2)
    entries[temp[0]] = ['eventsource-polyfill', entry]
  })
  return entries
}

console.log(getEntries('./src/*/main.js')) 
// toDo: diff the './' & '../'