/**

http://jsbin.com/yaxukiqefu/2/edit?html,js,output

  <div id="demo">
    <h2>Simple Math Demo</h2> 1st Number :
    <input type="text" name="num1">
    <br/> 2nd Number :
    <input type="text" name="num2">
    <button>ADD</button>
    <br/> Sum :
    <result></result>
  </div>

**/


/** MAG.JS - simple math example **/


mag.module("demo", {
  controller:function(){
    this.num1 = 2;
    this.num2= 2;
  },
  view: function(state) {
    state.button = {
      _onclick: function() {
        state.result = parseInt(state.num1) + parseInt(state.num2);
      }
    };
  }
});
