
/*
  <div id="sortable">
    <table>
      <tr>
        <th data-sort-by="name">Name</th>
        <th data-sort-by="age">Age</th>
      </tr>
      <tr class="list">
        <td class="name"></td>
        <td class="age"></td>
      </tr>
    </table>
  </div>
*/

var table = {}

table.view = function(element, props, state) {
  state.list = props.list
  state.table = sorts(state.list)
}

function sorts(list) {
  return {
    _onclick: function(e) {
      var prop = e.target.getAttribute("data-sort-by")
      if (prop) {
        var first = list[0]
        list.sort(function(a, b) {
          return a[prop] > b[prop] ? 1 : a[prop] < b[prop] ? -1 : 0
        })
        if (first === list[0]) list.reverse()
      }
    }
  }
}

mag.module("sortable", table, {
    list : [{
    name: "John",
    age: 21
  }, {
    name: "Mary",
    age: 25
  }, {
    name: "Bob",
    age: 47
  }]
})
