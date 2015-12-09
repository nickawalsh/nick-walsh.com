//= require 'vendor/three.min.js'
//= require_tree .
//= require 'earth.js'

const data = [
  {long: -81.173, lat: 28.4, r: 8}, // FL
  {long: -81.1, lat: 32.084, r: 3}, // Savannah
  {long: -74.006, lat: 40.713, r: 5}, // NY
  {long: -0.128, lat: 51.507, r: 2}, // London
  {long: -87.63, lat: 41.878, r: 2}, // Chicago
  {long: -122.419, lat: 37.775, r: 2}, // SF
  {long: -90.199, lat: 38.627, r: 3}, // St Louis
  {long: -77.345, lat: 25.06, r: 5}, // Nassau
  {long: -117.783, lat: 33.542, r: 2}, // Laguna
  {long: -149.9, lat: 61.218, r: 2}, // Anchorage
  {long: -123.121, lat: 49.283, r: 2}, // Vancouver
  {long: 25.462, lat: 36.393, r: 2}, // Santorini
  {long: -122.676, lat: 45.523, r: 3}, // Portland
  {long: -95.401, lat: 29.817, r: 2} // Houston
]

const container = document.getElementById('map');
const planet = new Earth(container, data);
