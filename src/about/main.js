import 'normalize.css';
// var Greeter = require('./app/Greeter.js');
import Greeter from './app/Greeter';
import $ from 'jquery';
import _ from 'lodash';

// document.getElementById('root').appendChild(Greeter());
$('#root').append(Greeter());
console.log("At page 'main' :", _);