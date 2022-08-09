import mag from '../src/mag';

describe('MagJS template literals', function() {
  beforeEach(() => {
    document.body.innerHTML = "<div id='root'></div>";
  });

  it('can take children with no root parent with inline click', () => {
    global.test = function() {};

    var App = mag`<li onclick="test()">one</li><li>two</li>`;

    expect(typeof App).toEqual('object');
    expect(App.childElementCount).toEqual(2);
    expect(App.nodeType).toEqual(1);
    expect(App.childNodes.length).toEqual(4);

    // attach to dom
    mag(App, 'root');
    expect(document.body.querySelector('li').textContent).toEqual('one');

    document.querySelector('li').click();
  });

  it('can take prop with with inline click', () => {
    var App = mag('<div>', props => {
      global.test = function() {
        App({name: 'test'});
      };

      return mag`<li onClick="test()">${props.name}</li><li>two</li>`;
    });

    // attach to dom
    mag(App({name: 'first'}), 'root');
    expect(document.body.querySelector('li').textContent).toEqual('first');

    document.querySelector('li').click();

    expect(document.body.querySelector('li').textContent).toEqual('test');
  });

  it('can take prop with with variable click', () => {
    var App = mag('<div>', props => {
      const test = function() {
        App({name: 'test'});
      };

      return mag`<li onClick="${test}">${props.name}</li>`;
    });

    // attach to dom
    mag(App({name: 'first'}), 'root');
    expect(document.body.querySelector('li').textContent).toEqual('first');

    document.querySelector('li').click();

    expect(document.body.querySelector('li').textContent).toEqual('test');
  });

  it('can take prop with with variable input', () => {
    var App = mag('<div>', props => {

      const test = function(e) {
        App({name: e.target.value});
      };

      return mag`<input oninput="${test}" value=${props.name}>`;
    });

    // attach to dom
    mag(App({name: 'first'}), 'root');
    expect(document.body.querySelector('input').value).toEqual('first');

    document.querySelector('input').value = 'M';
    var event1 = new Event('input');
    document.querySelector('input').dispatchEvent(event1);
    document.querySelector('input').value = 'Mi';
    var event2 = new Event('input');
    document.querySelector('input').dispatchEvent(event2);

    expect(document.body.querySelector('input').value).toEqual('Mi');
  });


  it('can take prop with with variable click multiple', () => {
    var App = mag('<div>', props => {
      const test = function() {
        App({name: 'test'});
      };

      const dyna = {things: 1};

      return mag`<li onClick="${test}" dyna=${dyna}>${props.name}</li>`;
    });

    // attach to dom
    mag(App({name: 'first'}), 'root');
    expect(document.body.querySelector('li').textContent).toEqual('first');

    document.querySelector('li').click();

    expect(document.body.querySelector('li').textContent).toEqual('test');
    // expect(document.body.querySelector('li').outerHTML).toEqual('<li>test</li>');
  });

  it('can take prop with with variable click multiple passing', () => {
      mag.Sub = mag('<p>', props=>{
          return mag`<button onClick="${props.onclick}">${props.children}</button>`
      })
    var App = mag('<div>', props => {
      const test = function() {
        App({name: 'test'});
      };

      const dyna = {things: 1};

      return mag`<Sub onClick="${test}" dyna=${dyna}><b>${props.name}</b></Sub>`;
    });

    // attach to dom
    mag(App({name: 'first'}), 'root');
    expect(document.body.querySelector('#root p button').outerHTML).toEqual('<button><b>first</b></button>');

    expect(document.body.querySelector('p button').textContent.trim()).toEqual('first');

    document.querySelector('p button').click();

    expect(document.body.querySelector('p').textContent).toEqual("\ntest\n");
    // expect(document.body.querySelector('p').outerHTML).toEqual('<p>test</p>');
  });

  it('can take prop with with variable click multiple passing text node child', () => {
      mag.Sub = mag('<p>', props=>{
          return mag`<button onClick="${props.onclick}">${props.children}</button>`
      })
    var App = mag('<div>', props => {
      const test = function() {
        App({name: 'test'});
      };

      const dyna = {things: 1};

      return mag`<Sub onClick="${test}" dyna=${dyna}>${props.name}</Sub>`;
    });

    // attach to dom
    mag(App({name: 'first'}), 'root');
    expect(document.body.querySelector('#root p button').outerHTML).toEqual('<button>first</button>');

    expect(document.body.querySelector('p button').textContent.trim()).toEqual('first');

    document.querySelector('p button').click();

    expect(document.body.querySelector('p').textContent).toEqual("\ntest\n");
    // expect(document.body.querySelector('p').outerHTML).toEqual('<p>test</p>');
  });

  it('can take prop with with variable click spaces', () => {
    var App = mag('<div>', props => {
      const test = function() {
        App({name: 'test'});
      };

      return mag`<li before="1" onClick="${test}" after="2">${props.name}</li>`;
    });

    // attach to dom
    mag(App({name: 'first'}), 'root');
    expect(document.body.querySelector('li').textContent).toEqual('first');

    document.querySelector('li').click();

    expect(document.body.querySelector('li').textContent).toEqual('test');
    expect(document.body.querySelector('li').getAttribute('before')).toEqual(
      '1'
    );
    expect(document.body.querySelector('li').getAttribute('after')).toEqual(
      '2'
    );
  });
});
