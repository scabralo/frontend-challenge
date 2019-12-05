$(function() {
  
  let tempData = {
    temp: '',
    tempMax: '',
    temoMin: '',
    message: '',
    weatherIcon: ''
  }
  let marker;
  let map;
  let geocoder;

  const $mapContainer = $('#map-container')
  const $locationInput = $('#location-input')
  const $locationForm = $('#location-search')

  // Overlay Elements
  const $stationName = $('#station-name')
  const $bikesAvailable = $('#bikes-available')
  const $docksAvailable = $('#docks-available')
  const $stationAddress = $('#station-address')

  $locationForm.submit(function(event) {
    onSubmitHandler(event)
  })

})