var greetings = require('../data/greetings.json');

module.exports = function() {
  var Greeter = document.createElement('div');
  Greeter.textContent = greetings.greetText;
  return Greeter;
}
