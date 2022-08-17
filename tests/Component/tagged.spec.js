import mag from '../../src/mag';
import '../../src/hookins/mag.useState';

beforeEach(() => {
  document.body.innerHTML = "<div id='root'></div>";
});


test('tag with two child comp', () => {
  mag.Message = function(props) {
    return props.children;
  };
  // Define Component:
  const App = function() {
    return Mag`<Message>
    HI
    There
    <i>more</i>
    </Message>`;
  };

  // Render Component with Props:
  Mag(App(), document.getElementById('root'));

  expect(document.querySelector('#root').textContent.trim()).toContain("HI");
  expect(document.querySelector('#root i').textContent).toBe('more');
});

test('tag with child comp', () => {
  mag.Message = function(props) {
    return props.children;
  };
  // Define Component:
  const App = function() {
    return Mag`<Message>HI</Message>`;
  };

  // Render Component with Props:
  Mag(App(), document.getElementById('root'));

  expect(document.querySelector('#root').textContent.trim()).toContain('HI');
});

test('tag with global func', () => {
  // Define Component:
  mag.App = function() {
    return `<h1>HI</h1>`;
  };

  // Render Component with Props:
  Mag(mag`<App/>`, document.getElementById('root'));

  expect(document.querySelector('#root').textContent.trim()).toContain('HI');
});

test('tag children with func', () => {
  const Message = Mag(props => {
    return props.children;
  });

  const HelloMessage = Mag(props => {
    return mag`
          <${props.message}>
            Hello ${props.name}
          <//>
          `;
  });

  Mag(
    mag`<${HelloMessage} name="Taylor" message=${Message} />`,
    document.getElementById('root')
  );

  expect(document.querySelector('#root').textContent.trim()).toContain(
    'Hello Taylor'
  );
});

test('tag children', () => {
  const Message = props => {
    return props.children;
  };

  const HelloMessage = props => {
    return mag`
          <${Message}>
            Hello ${props.name}
          <//>
          `;
  };

  Mag(mag`<${HelloMessage} name="Taylor" />`, document.getElementById('root'));

  expect(document.querySelector('#root').textContent.trim()).toEqual(
    'Hello Taylor'
  );
});

test('func no template', () => {
  const HelloMessage = Mag(props => {
    return `
          <div>
            Hello ${props.name}
          </div>
          `;
  });

  Mag(HelloMessage({name: 'Taylor'}), document.getElementById('root'));

  expect(document.querySelector('#root fragment').textContent.trim()).toEqual(
    'Hello Taylor'
  );
});

test('tag variable', () => {
  const HelloMessage = props => {
    return `
          <div>
            Hello ${props.name}
          </div>
          `;
  };

  Mag(mag`<${HelloMessage} name="Taylor" />`, document.getElementById('root'));

  expect(document.querySelector('#root fragment').textContent.trim()).toEqual(
    'Hello Taylor'
  );
});

test('basic whole tag', () => {
  mag.Router = mag(`<div/>`, props => {
    return {};
  });

  var App = mag`<Router></Router>`;

  mag(App, 'root');

  expect(document.querySelector('#root fragment').innerHTML.trim()).toEqual(
    '<div></div>'
  );
});

test('invalid open html tag', () => {
  global.App = mag(`<h1>im in a fancy component now!</h1>`, props => {
    // javascript stuff goes here

    return {};
  });

  mag(
    mag`<div>
    <App   />
  </div>`,
    document.getElementById('root')
  );

  expect(document.querySelectorAll('#root h1').length).toEqual(1);
});

test('invalid open html tags with one attribute without quotes', () => {
  global.App = mag(`<h1>im in a fancy component now!</h1>`, props => {
    // javascript stuff goes here

    return {};
  });

  mag(
    mag`<div>
    <App key=1 />
    <App key=2 />
    <App key=3 />
  </div>`,
    document.getElementById('root')
  );

  expect(document.querySelectorAll('#root h1').length).toEqual(3);
});

test('invalid open html tags with one attribute with quotes', () => {
  global.App = mag(`<h1>im in a fancy component now!</h1>`, props => {
    // javascript stuff goes here

    return {};
  });

  mag(
    mag`<div>
    <App key="1" />
    <App key="2" />
    <App key=3 />
  </div>`,
    document.getElementById('root')
  );

  expect(document.querySelectorAll('#root h1').length).toEqual(3);
});

test('invalid open html tags with two attribute without quotes', () => {
  global.App = mag(`<h1>im in a fancy component now!</h1>`, props => {
    // javascript stuff goes here

    return {};
  });

  mag(
    mag`<div>
    <App key="1" name=John />
    <App key="2" date=${new Date()} />
    <App key=3 />
  </div>`,
    document.getElementById('root')
  );

  expect(document.querySelectorAll('#root h1').length).toEqual(3);
});
