// http://embed.plnkr.co/Gjuycl4GdTj2TJijmpjq/
/*

index.html
app-init.js
TabList.js
CountriesComponent.js
style.css

.hide {
  display:none;
}
#reactExampleGoesHere a,
#reactExampleGoesHere a {
  border: 1px solid;
  margin-right: 10px;
  text-decoration: none;
  background-color: #2bbb5b;
  color: white;
  padding: 10px;
}
#reactExampleGoesHere a.excited,
#reactExampleGoesHere a.excited {
  background-color: #2bbb5b;
}
#reactExampleGoesHere a.neutral,
#reactExampleGoesHere a.neutral {
  background-color: #39a5de;
}
#reactExampleGoesHere div.list,
#reactExampleGoesHere div.list {
  height: 70px;
}
*/
/*
  <div id="reactExampleGoesHere">

    <div class="countryList"></div>
    <div class="cityList"></div>

    <div class="template hide">
      <div id="TabList">
        <div class="list">
          <a></a>
        </div>
      </div>
    </div>
  </div>
  */
  
  
  // app-init.js



// initialize mag module reference


var citiesPerCountry = [
  ['New York', 'Detroit'],
  ['Ontario', 'Toronto']
]

var countries = ['USA', 'CAN']

var props = {
  citiesPerCountry: citiesPerCountry,
  countries: countries
}

 mag.mods.demo.CountriesComponent("reactExampleGoesHere", props)
 
 
 // countriescomponent.js


(function(namespace) {

  var props = {}

  var CountriesComponent = {}


  CountriesComponent.controller = function(props) {

    this['active-country'] = 0
    this['active-city'] = 0

    this.currentCountry = props.countries[0]

    this.handleClick = function(type, item, index, event) {
      if (type == 'country') this.currentCountry = item
      
      this['active-' + type] = index
      
      event.preventDefault();
    }.bind(this)

  }

  CountriesComponent.view = function(state, props) {

    state.countryList = mag.mods.demo.TabList({
      key: "countryList",
      active: state['active-country'],
      items: props.countries,
      clickHandler: state.handleClick.bind(state, 'country')
    }, true)


    state.cityList = mag.mods.demo.TabList({
      key: state.currentCountry,
      active: state['active-city'],
      items: props.citiesPerCountry[state['active-country']],
      clickHandler: state.handleClick.bind(state, 'city')
    }, true)

  }

  namespace.CountriesComponent = mag.comp('', CountriesComponent, props);

})(mag.namespace('mods.demo'));

// TabList.js

(function(namespace) {


  // default props to be over ridden
  var props = {
    active: 0
  }


  var TabList = {}

  TabList.controller = function(props) {
    this.active = props.active || 0
  }

  TabList.view = function(state, props) {

    state.list = {
      a: props.items.map(function(item, i) {
        return {
          _className: {
            "excited": i == state.active,
            "neutral": i != state.active
          },
          _href: "#",
          _text: item,
          _onclick: function(a, event) {
            state.active = a
            props.clickHandler(item, a, event);
          }.bind(state, i)
        }
      })
    }
  }



  namespace.TabList = mag.comp('TabList', TabList, props);

})(mag.namespace('mods.demo'));
