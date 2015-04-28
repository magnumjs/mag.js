/*
<div id="weatherApp" style="display:none">
  <div>
    <h4>Cities weather report</h4>
    <input name="cityName" placeholder="Type a city to add" style="width:130px" />
    <button class="add">Add</button>
    <div class="loader">
      -- Loading --
    </div>
    <div class="cities">
      <div class="city">
        <cityIndex></cityIndex>)
        <img src="{weather.icon}" title="{weather.description}" />
        <span style="white-space:nowrap">
          <span class="name">{city.name}</span>, <span class="country">{city.country}</span>
        </span>
      </div>
    </div>
    <button class="refresh">Refresh</button>
  </div>
</div>
*/

/* React 2 Mag.JS: weatherApp example */

// From: http://wix.github.io/react-templates/

var weatherApp = {}

weatherApp.controller = function(props) {

  this.cityName = ''

  this.willupdate = function(event, node) {
    node.style.display = 'none'
  }

  this.didupdate = function(event, node) {
    node.style.display = 'block'
  }

  this.mapData = function(item, idx) {
    return {
      img: {
        _title: item.weather[0].description,
        _src: 'http://openweathermap.org/img/w/' + item.weather[0].icon + '.png'
      },
      cityIndex: idx + 1,
      icon: item.weather[0].icon,
      name: item.name,
      country: item.sys.country,
      description: item.weather[0].description
    }
  }

  this.fetchWeather = function() {
    props.weatherService.fetchWeather(props.cityIds, function(values) {
      this.city = values.list.map(this.mapData)
    }.bind(this))
  }.bind(this)

  this.addCity = function(cityName) {
    props.weatherService.findCity(cityName, function(result) {
      if (result.id && props.cityIds.indexOf(result.id) < 0) {
        props.cityIds.unshift(result.id);
        this.fetchWeather();
      }
    }.bind(this))
  }.bind(this)

  this.willload = function() {
    this.fetchWeather()
  }.bind(this)

  this.handleAddCity = function() {
    // add city
    if (this.cityName) {
      this.addCity(this.cityName)
    }
    this.cityName = ''
  }.bind(this)

}

weatherApp.view = function(state) {

  state.refresh = {
    _onclick: state.fetchWeather
  }
  state.input = {
      _onkeydown: function(e) {
        if (e.keyCode === 13) {
          e.preventDefault()
          state.handleAddCity()
        }
      }
    }
    // helper for above ui bindings to model
  mag.addons.binds(state, state.input)

  state.add = {
    _onclick: state.handleAddCity
  }
}

var weatherService = function() {

  function getData(url, callback) {
    return mag.addons.requestWithFeedback({
      url: url
    }).then(callback)
  }

  return {
    findCity: function(cityToAdd, callback) {
      return getData('http://api.openweathermap.org/data/2.5/weather?q=' + cityToAdd, callback)
    },
    fetchWeather: function(cityIds, callback) {
      return getData('http://api.openweathermap.org/data/2.5/group?id=' + cityIds.join(',') + '&units=metric', callback)
    }
  }
}

mag.module('weatherApp', weatherApp, {
  cityIds: [5391959, 293397, 2643743],
  weatherService: new weatherService()
})

/*
- WeatherBox
  - WeatherAddCityForm
  - WeatherCityList
    - WeatherCity
  */
