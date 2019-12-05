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

  /*
  * This is the function the Google Maps API will use as callback.
  */
  function init() {

    const initialLocation = new google.maps.LatLng(39.95228,-75.16245) // Philadelphia
    const initialZoomLevel = 16
    const mapProps = {
      center: initialLocation,
      zoom: initialZoomLevel,
      mapTypeControl: false,
      fullscreenControl: false,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#bdbdbd"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ffffff"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dadada"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#c9c9c9"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        }
      ]
    }
    map = new google.maps.Map($mapContainer.get(0), mapProps)
    geocoder = new google.maps.Geocoder();
    getWeatherData({lat: 39.95228, lng:-75.16245})
    indegoStations()
  }

  /*
   * A simple function that returns the formated object for the tempData variable
   * @param tempDataObj The object returned by the weather API
   * @return obj The formatted object with the temp data
   */
  function tempDataFormater(tempDataObj) {
    let messageText = ''
    const tempId = tempDataObj.weather[0].id
    //const tempId = 702
    

    if(tempId >= 701 && tempId < 782) {
      messageText = 'Terrible atmospheric conditions. Be careful!'
    }

    return {
      temp: Math.floor(tempDataObj.main.temp),
      tempMax: Math.floor(tempDataObj.main.temp_max),
      tempMin: Math.floor(tempDataObj.main.temp_min),
      tempIcon: 'http://openweathermap.org/img/wn/'+ tempDataObj.weather[0].icon + '.png',
      message: messageText,
    }
  }

  /*
  * This function gets the temperature information from OpenWeather (https://openweathermap.org/current)
  * @param lat The latitude of the address provided by the user
  * @param lon The longitude of the address provided by the user
  */
  function getWeatherData(location) {
    const api = 'c6cef3844c23c32ef3065e03fcaa8716'
    const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + location.lat + "&lon=" + location.lng + "&units=imperial&appid=" + api

    $.ajax({
      url,
      method: 'GET'
    }).then(function(resp){
      console.log('resp',resp)
      tempData = tempDataFormater(resp)
      updateTempInformation(tempData)
    })
  }

  /*
   * This function updates the information regarding the temperature for the location provided by the user
   * @param tempObj The formatted object containing the temp data
   */
  function updateTempInformation(tempObj) {
    const $temp = $('.temp-value')
    const $tempMax = $('.max-temp-value')
    const $tempMin = $('.min-temp-value')
    const $weatherIcon = $('.weather-icon')
    const $weatherMessageWrapper = $('.weather-message-wrapper')
    const $message = $('.weather-message')

    $temp.text(tempObj.temp)
    $tempMax.text(tempObj.tempMax)
    $tempMin.text(tempObj.tempMin)
    $weatherIcon.attr('src', tempObj.tempIcon)

    if(tempObj.message !== '') {
      $message.text(tempObj.message)
      $weatherMessageWrapper.removeClass('hidden')
    } else {
      $weatherMessageWrapper.addClass('hidden')
    }
    
  }

  /*
   * This function will take care of the submit event for the address form.
   */
  function onSubmitHandler(event) {
    event.preventDefault()
    const address = $locationInput.val().trim()
    $locationInput.val('')

    geocoder.geocode({ address }, function(results, status) {
      geocoderResultHandler(results[0].geometry.location, status)
    })
  }

  /*
   * This function handles the Result returned by the geocoder
   * @param location Location objec with lat and lng properties
   * @param status The status code returned by the geocoder
   */
  function geocoderResultHandler(location, status) {
    if(status === 'OK') {

      const newLocationObj = {
        lat: location.lat(),
        lng: location.lng()
      }

      marker && marker.setMap(null)
      marker = new google.maps.Marker({
        position: newLocationObj
      })
      marker.setMap(map)

      map.setCenter(location)

      getWeatherData(newLocationObj)

    }
  }

  /*
   * This function gets the Indego Stations from their API and places them on the map
   */
  function indegoStations() {
    const url = 'https://dkw6qugbfeznv.cloudfront.net/'
    
    map.data.loadGeoJson(url)
    map.data.setStyle(function(feature) {

      const bikes = feature.getProperty("bikesAvailable")
      const docks = feature.getProperty("docksAvailable")
      const title = bikes.toString() + ' bikes and ' + docks.toString() + ' docks available'
      const text =  bikes.toString()

      const label = {
        text,
        fontSize: '18px',
        fontWeight: '500'
      }

      switch(true) {
        case (bikes === 0) :
          icon = 'assets/imgs/map-marker-red.png'
          label.color = '#D41919'
          break
        case (bikes <= 5) :
          icon = 'assets/imgs/map-marker-yellow.png'
          label.color = '#D4B319'
          break
        default :
          icon = 'assets/imgs/map-marker-green.png'
          label.color = '#008000'
          break
      }
      return ({
        title,
        icon,
        label
      })
    })
    map.data.addListener('click', function(event) {
      onClickHandler(event)
    })
  }

  /*
   * This function handles the click event on the data layer markers
   */
  function onClickHandler(event) {
    const markerInfo = event.feature.h
    populateOverlay(markerInfo)
    $('#overlay').fadeIn(300);
  }

  /*
   * This function populates the data inside the overlay that's shown when users click on a marker on the data layer
   * @param info An object containing all the info related to the marker that was clicked by the user
   */
  function populateOverlay(info) {
    $stationName.text(info.name)
    $bikesAvailable.text(info.bikesAvailable.toString())
    $docksAvailable.text(info.docksAvailable.toString())
    $stationAddress.text(info.addressStreet)
  }

  $('#close').click(function() {
    $('#overlay').fadeOut(300);
  });

})