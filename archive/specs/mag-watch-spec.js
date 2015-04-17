var app;
mag.watch.getScope = function () {
};
describe("mag-watch", function () {
  it("is defined", function () {
    expect(mag.watch).toBeDefined();
  });
  it("captures dom changes", function () {
    $html = affix('#test34 span.test34+p.test34+input.test34');
    var app = mag.module('apper');
    app.control('test34', function (Scope) {

      Scope.test34 = 'Hi!';
      Scope.asd = '';

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
  it("handles promises", function (done) {
    $html = affix('#gitUserInfo .data .id');

    //$html.find('.data').text('[[id]]');

    var githubUser = mag.module('app', []);

    githubUser.service('GithubUserService', function () {
      this.getById = function (userId) {
        return $.get('specs/github.json?id=' + userId).then(
          function (response) {
            return response;
          });
      };
    });
    githubUser.control('gitUserInfo', function (Scope, GithubUserService) {
      Scope.data = GithubUserService.getById('magnumjs');
    });
    setTimeout(function () {
      expect($('#gitUserInfo .id').text()).toEqual('5196767');
      done();
    }, 400);

  });
  xit("watches changes to an object", function () {
    // test with mocks or real module?
    var spy = spyOn(mag.watch, 'getScope');
    spy.and.returnValue({
      test: true
    });
    mag.watch.serve('test');
  });
});
