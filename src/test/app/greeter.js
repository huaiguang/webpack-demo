import greetings from '../data/greetings.json';

module.exports = function() {
  var Greeter = document.createElement('div');
  Greeter.textContent = greetings.greetText;
  return Greeter;
}
