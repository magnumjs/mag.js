var selector = '#container';
var data = {
  name: "Joe"
};
var ele;
describe("domElement", function() {
  beforeEach(function() {
    affix('#container h1.name+input.name+input.box[type="checkbox"]+textarea.me+select.other>option+option[value="34"]');
    $html = $(selector);
    ele = mag.domElement();
  });
  it("is defined", function() {
    expect(mag.domElement).toBeDefined();
    expect($html.find('input[type="checkbox"]').hasClass('box')).toEqual(true);
  });
  describe("selecting html", function() {
    it("using custom data key", function() {
      data.add = 'test';
      $html.find('input.name').attr('data-event', 'add');
      ele.getSelectorDataKey('event');
      var eles = ele.findElementsByKey('add');
      expect(eles[0].nodeName).toEqual('INPUT');
      expect(eles).toHaveLength(1);
    });
    it("using custom partial data key", function() {
      data.add = 'test';
      $html.find('input.name').attr('data-event-click', 'add');
      ele.getSelectorDataKey('event');
      var eles = ele.findElementsByKey('add');
      expect($html.find('input.name').prop('outerHTML')).toEqual('<input class="name" data-event-click="add" mg-event="click">');
      expect(eles[0].nodeName).toEqual('INPUT');
      expect(eles[0].getAttribute('data-event-click')).toEqual('add');
      expect(eles[0].getAttribute('mg-event')).toEqual('click');
      expect(eles).toHaveLength(1);
    });
    it("by one key", function() {
      var eles = ele.findElementsByKey('container');
      //console.log(eles.length);
      expect(eles).toHaveLength(1);
    });
    it("by data key", function() {
      var eles = ele.findElementsByKeys(data, $html[0]);
      expect(eles[0].key).toEqual('name');
      expect(eles).toHaveLength(1);
    });
    it("by multiple data key", function() {
      data.textarea = 'test';
      var eles = ele.findElementsByKeys(data);
      //console.log(eles);
      expect(eles[0].key).toEqual('name');
      expect(eles[0].elements.length).toEqual(2);
      expect(eles[1].elements.length).toEqual(1);
      expect(eles[1].key).toEqual('textarea');
      expect(eles).toHaveLength(2);
    });
    it("by multiple nested data key", function() {
      data.textarea = 'test';
      $html.find('select').affix('textarea#other');
      var eles = ele.findElementsByKeys(data);
      //console.log(eles);
      expect(eles[0].key).toEqual('name');
      expect(eles[0].elements.length).toEqual(2);
      expect(eles[1].elements.length).toEqual(2);
      //TODO: verify corerct parent Nodes
      //console.log(eles[1].elements[1].parentNode);
      expect(eles[1].key).toEqual('textarea');
      expect(eles).toHaveLength(2);
    });
    it("with non matching data key", function() {
      data.textarea2 = 'test';
      var eles = ele.findElementsByKeys(data);
      //console.log(eles);
      expect(eles[0].key).toEqual('name');
      expect(eles[0].elements.length).toEqual(2);
      expect(eles[1].key).toEqual('textarea');
      expect(eles[2]).not.toBeDefined();
      expect(eles).toHaveLength(2);
    });
  });
});
