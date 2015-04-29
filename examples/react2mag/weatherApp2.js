/*
<div id="weatherApp" class="hide">
  <h2>Weather App</h2>
  <div id="WeatherForm">
    <form>
      <input name="cityName" placeholder="Type a city to add" />
      <button class="add">Add</button>
    </form>
  </div>
  <div class="loader">
    -- Loading --
  </div>
  <div id="cityList">
    <div class="city">
    </div>
  </div>
  <button class="refresh">Refresh</button>

</div>

<div id="City" class="hide">
  <cityIndex></cityIndex>)
  <img src="{weather.icon}" title="{weather.description}" />
  <span style="white-space:nowrap">
        <span class="name">{city.name}</span>, <span class="country">{city.country}</span>
  </span>
</div>
*/

/* React 2 Mag.JS: weatherApp example */

// From: http://wix.github.io/react-templates/

var weatherApp = {}

weatherApp.controller = function(props) {

  this.data = []
  
  this.fetchWeather = function() {
    props.weatherService.fetchWeather(props.cityIds, function(values) {
      this.data = values.list
    }.bind(this))
  }.bind(this)

  this.willload = function() {
    this.fetchWeather()
  }.bind(this)

  this.didload = function(event, node) {
    node.classList.remove('hide')
  }

  this.handleAddCity = function(cityName) {
    props.weatherService.findCity(cityName, function(result) {
      if (result.id && props.cityIds.indexOf(result.id) < 0) {
        props.cityIds.unshift(result.id);
        this.fetchWeather();
      }
    }.bind(this))
  }.bind(this)

}

weatherApp.view = function(state, props) {
  
  mag.module('cityList', CityList, {
    data: state.data,
    weatherService: weatherService
  })
  
  mag.module('WeatherForm', WeatherForm, {
    onAddCity: state.handleAddCity,
  })

  state.refresh = {
    _onclick: state.fetchWeather
  }
}

var WeatherForm = {
  controller: function(props) {

    this.handleAdd = function(e) {
      e.preventDefault()
        // add city
      if (this.cityName) {
        props.onAddCity(this.cityName)
      }
      this.cityName = ''
    }.bind(this)

  },
  view: function(state, props) {

    mag.addons.binds(state, state.input = {})

    state.add = {
      _onclick: state.handleAdd
    }
  }
}


var CityList = {
  controller: function(props) {
    this.promises = props.data.map(function(item, idx) {
      item.index = idx
      return mag.module('City', City, new props.weatherService(item), 1)
    })
  },
  view: function(state, props) {

    mag.addons.when(state.promises, function(values) {
      state.city = values
    })

  }
}

var City = {
  view: function(state, props) {
    state.cityIndex = props.cityIndex
    state.img = props.img
    state.name = props.name
    state.country = props.country
  }
}

var weatherService = function(data) {
  data = data || {}
  this.img = {
    _title: data.weather[0].description,
    _src: 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png'
  }
  this.cityIndex = data.index + 1
  this.icon = data.weather[0].icon
  this.name = data.name
  this.country = data.sys.country
  this.description = data.weather[0].description
}

weatherService.fetchWeather = function(cityIds, callback) {
  return dataService.getData('http://api.openweathermap.org/data/2.5/group?id=' + cityIds.join(',') + '&units=metric', callback)
}

weatherService.findCity = function(cityToAdd, callback) {
  return dataService.getData('http://api.openweathermap.org/data/2.5/weather?q=' + cityToAdd, callback)
}

var dataService = function() {}
dataService.getData = function(url, callback) {
  return mag.addons.requestWithFeedback({
    url: url
  }).then(callback)
}

mag.module('weatherApp', weatherApp, {
  cityIds: [5391959, 293397, 2643743],
  weatherService: weatherService
})

/*
- WeatherBox
  - WeatherAddCityForm
  - WeatherCityList
    - WeatherCity
  */
  
http://jsbin.com/zihuwelete/edit?html,js,output
