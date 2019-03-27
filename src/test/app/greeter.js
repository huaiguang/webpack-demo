import greetings from '../data/greetings.json';

export default function() {
  var Greeter = document.createElement('div');
  Greeter.textContent = greetings.greetText;
  return Greeter;
}
