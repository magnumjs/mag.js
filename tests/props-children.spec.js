import mag from '../src/mag';

let AppSingle, AppLoop;

beforeEach(() => {
  document.body.innerHTML = `
<div id="app">
<thing>
  <i>INNNER Children 
    <b>HTML</b></i>
</thing>
</div>


<div class="hello">
<h3>Hello World</h3>
<div></div>
</div>
`;
});

test('tag children frag', () => {
  const template = `
    <p>
      You clicked 
      <count /> times
    </p>
    <button>Click me</button>
  `;
  //Component:
  Mag.Counter = Mag(function(props) {
    return {
        _html: props.children,
        count: props.count,
        button: {
        onClick: () =>
          Mag.Counter({count: props.count + 1})
      }
    };
  })

  //Render:
  Mag(Mag`<Counter count=0>${template}<//>`, document.getElementById('app'));

  expect(document.querySelector('#app').innerHTML).toContain("You clicked");
  expect(document.querySelector('#app').innerHTML).toContain("0");
  document.querySelector('#app button').click()
  expect(document.querySelector('#app').innerHTML).toContain("1");

});


test('tag children', () => {
  const template = `<div>
    <p>
      You clicked 
      <count /> times
    </p>
    <button>Click me</button>
  </div>`;
  //Component:
  Mag.Counter = Mag(function(props) {
    return {
        _html: props.children,
        count: props.count,
        button: {
        onClick: () =>
          Mag.Counter({count: props.count + 1})
      }
    };
  })

  //Render:
  Mag(Mag`<Counter count=0>${template}<//>`, document.getElementById('app'));

  expect(document.querySelector('#app').innerHTML).toContain("You clicked");
  expect(document.querySelector('#app').innerHTML).toContain("0");
  document.querySelector('#app button').click()
  expect(document.querySelector('#app').innerHTML).toContain("1");

});

test('props.children single', () => {
  const Hello = mag('hello', props => {
    return {
      div: {
        _html: props.children
      }
    };
  });
  AppSingle = mag('app', props => ({
    thing: Hello()
  }));
  AppSingle();
  expect(document.querySelector('thing')).toBeDefined();
  expect(document.querySelectorAll('#app > thing').length).toEqual(1);
  expect(document.querySelector('thing .hello h3').textContent).toEqual(
    'Hello World'
  );
  expect(
    document.querySelector('thing .hello div thing i b').textContent
  ).toEqual('HTML');
});

test('props.children loop', () => {
  const Hello = mag('hello', props => {
    return {
      div: {
        _html: props.children
      }
    };
  });
  AppLoop = mag('app', props => ({
    thing: props.items.map((name, key) => Hello({name, key}))
  }));
  AppLoop({items: ['first', 'second']});
  expect(document.querySelector('thing')).toBeDefined();
  expect(document.querySelectorAll('#app thing').length).toEqual(2);
  //expect(document.querySelectorAll("#app thing").item(0).querySelector("i b").textContent).toEqual("HTML")
  // expect(document.querySelectorAll("#app > thing").item(1).querySelector("i b").textContent).toEqual("HTML")
});
