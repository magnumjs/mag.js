var app;
mag.watch.getScope = function() {};
describe("mag-watch", function() {
  it("is defined", function() {
    expect(mag.watch).toBeDefined();
  });
  it("captures dom changes", function() {
    $html = affix('#test34 span.test34+p.test34+input.test34');
    var app = mag.module('apper');
    app.control('test34', function(Scope) {
      
      Scope.test34 = 'Hi!';
       Scope.asd ='';
      
    });

    expect($html.find('input')[0].value).toEqual('Hi!');
    expect($html.find('span').text()).toEqual('Hi!');

    $html.find('input').val('assad');
    //$('input').trigger('change');

    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    $('input')[0].dispatchEvent(evt);

    expect($html.find('input').val()).toEqual('assad');
    expect($html.find('span').text()).toEqual('assad');
    expect($html.find('p').text()).toEqual('assad');
  });
  xit("watches changes to an object", function() {
    // test with mocks or real module?
    var spy = spyOn(mag.watch, 'getScope');
    spy.and.returnValue({
      test: true
    });
    mag.watch.serve('test');
  });
});
