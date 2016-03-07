import { tree, renderApp, renderTree } from 'rendering';

describe('tree', () => {
  it('creates a tree', () => {
    assert.deepEqual(
      tree('div', {foo: 'foo'}, tree('span', {bar: 'bar'})),
      {
        component: 'div',
        props: {foo: 'foo'},
        children: [{
          component: 'span',
          props: {bar: 'bar'},
          children: [],
        }],
      });
  });
});

describe('renderTree', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('renders an HTML element with text', () => {
    renderTree(
      tree('span', {}, 'Some text'),
      container);
    assert.equal(container.children.length, 1);
    assert.equal(container.innerHTML, '<span>Some text</span>');
  });

  it('renders an HTML element with a number', () => {
    renderTree(
      tree('span', {}, 5),
      container);
    assert.equal(container.children.length, 1);
    assert.equal(container.innerHTML, '<span>5</span>');
  });

  it('renders an HTML element with attributes', () => {
    renderTree(
      tree('div', {'data-foo': 'foo', 'data-bar': 'bar'}),
      container);
    assert.equal(container.children.length, 1);
    const el = container.children[0];
    assert.equal(el.getAttribute('data-foo'), 'foo');
    assert.equal(el.getAttribute('data-bar'), 'bar');
  });

  it('renders nested HTML elements', () => {
    renderTree(
      tree('div', {},
        tree('div', {foo: 'foo'},
          tree('a', {href: '#bar'}, 'Go to bar'),
        ),
        tree('a', {href: '#baz'},
          tree('span', {},
            tree('strong', {}, 'Go to baz'),
          ),
        ),
      ),
      container);
    assert.equal(
      '<div>' +
        '<div foo="foo"><a href="#bar">Go to bar</a></div>' +
        '<a href="#baz"><span><strong>Go to baz</strong></span></a>' +
      '</div>',
      container.innerHTML);
  });

  it('renders custom components', () => {
    const Count = ({ state }) => tree('span', {}, 'Count is ', state);
    renderTree(
      tree(Count, {state: 10}),
      container);
    assert.equal(container.innerHTML, '<span>Count is 10</span>');
  });

  it('renders nested custom components', () => {
    const Count = ({ state }) => tree('span', {}, `Count is ${state}`);
    const Joiner = ({ stuff, things, state }) => tree('div', {},
      tree('span', {type: 'stuff'}, stuff.join(', ')),
      tree('strong', {type: 'things'}, things.join('-')),
      tree(Count, { state }),
    );
    renderTree(
      tree('div', {},
        tree(Joiner, {
          stuff: ['foo', 'bar', 'baz'],
          things: [1, 2, 3, 4, 5],
          state: 55,
        }),
        tree(Count, {state: 13}),
      ),
      container);
    assert.equal(
      container.innerHTML,
      '<div>' +
        '<div>' +
          '<span type="stuff">foo, bar, baz</span>' +
          '<strong type="things">1-2-3-4-5</strong>' +
          '<span>Count is 55</span>' +
        '</div>' +
        '<span>Count is 13</span>' +
      '</div>');
  });

  it('renders tightly nested custom components', () => {
    const Count = ({ state }) => tree('span', {}, `Count is ${state}`);
    const CountCount = ({ state }) => tree(Count, { state });
    const CountCountCount = ({ state }) => tree(CountCount, { state });
    renderTree(
      tree('div', {},
        tree(CountCountCount, {state: 88}),
        tree(CountCount, {state: 55}),
        tree(Count, {state: 13}),
      ),
      container);
    assert.equal(
      container.innerHTML,
      '<div>' +
        '<span>Count is 88</span>' +
        '<span>Count is 55</span>' +
        '<span>Count is 13</span>' +
      '</div>');
  });

  it('sets click handlers', () => {
    let clicked = false;
    const Button = ({ onClick }) => tree('button', { onClick }, 'Click me!');
    const handler = (e) => {
      e.preventDefault();
      clicked = true;
    };
    renderTree(
      tree(Button, {onClick: handler}),
      container);
    assert.equal(container.innerHTML, '<button>Click me!</button>');
    assert.equal(clicked, false);
    container.children[0].dispatchEvent(new Event('click'));
    assert.equal(clicked, true);
  });

  it('can set text children on custom components', () => {
    const Button = ({ onClick }, children) =>
      tree('button', { onClick }, ...children);
    renderTree(
      tree(Button, {onClick: () => {}}, 'The text'),
      container);
    assert.equal(container.innerHTML, '<button>The text</button>');
  });

  it('can set element children on custom components', () => {
    const Button = ({ onClick }, children) =>
      tree('button', { onClick }, ...children);
    renderTree(
      tree(Button, {onClick: () => {}},
        tree('span', {}, 'Some text'),
        tree('strong', {foo: 'foo'}, 'Strong text'),
      ),
      container);
    assert.equal(
      container.innerHTML,
      '<button>' +
        '<span>Some text</span>' +
        '<strong foo="foo">Strong text</strong>' +
      '</button>');
  });
});

describe('renderApp', () => {
  let container;
  let store;
  const CounterText = ({ counter }) => tree('span', {id: 'counter'},
    'The count is ',
    tree('strong', {}, counter),
  );
  const Counter = ({ counter }) =>
    tree('div', {},
      tree(CounterText, { counter }),
      tree('span', {id: 'unchanged'}, 'Text!'),
      tree('span', {}, counter),
    );

  beforeEach(() => {
    container = document.createElement('div');
    store = {
      state: {counter: 20},
      subscribe(fn) {
        this.subscriber = fn;
      },
      update(val) {
        this.state = val;
        this.subscriber();
      },
      getState() {
        return this.state;
      },
    };
  });

  it('updates the DOM', () => {
    renderApp(Counter, store, container);
    assert.equal(
      container.innerHTML,
      '<div>' +
        '<span id="counter">The count is <strong>20</strong></span>' +
        '<span id="unchanged">Text!</span>' +
        '<span>20</span>' +
      '</div>');
    // Update the store to render again.
    store.update({counter: 5});
    assert.equal(
      container.innerHTML,
      '<div>' +
        '<span id="counter">The count is <strong>5</strong></span>' +
        '<span id="unchanged">Text!</span>' +
        '<span>5</span>' +
      '</div>');
  });

  it('only updates changed nodes', () => {
    renderApp(Counter, store, container);
    const root = container.children[0];
    const unchanged = container.querySelector('#unchanged');
    // Update the store to render again.
    store.update({counter: 5});
    assert.equal(root, container.children[0], 'root should be the same');
    assert.equal(unchanged, container.querySelector('#unchanged'),
                 'unchanged should be the same');
  });

  it('will not let you render into a non-empty container', () => {
    container.appendChild(document.createElement('div'));
    assert.throws(() => {
      renderApp(Counter, store, container);
    }, /Cannot render into non-empty container/);
  });
});
