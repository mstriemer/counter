import { tree, renderTree } from 'rendering';

describe('tree', () => {
  it('creates a tree', () => {
    assert.deepEqual(
      tree('div', {foo: 'foo'}, [
        tree('span', {bar: 'bar'}),
      ]),
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
      tree('span', {}, ['Some text']),
      container);
    assert.equal(container.children.length, 1);
    assert.equal(container.innerHTML, '<span>Some text</span>');
  });

  it('renders an HTML element with a number', () => {
    renderTree(
      tree('span', {}, [5]),
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
      tree('div', {}, [
        tree('div', {foo: 'foo'}, [
          tree('a', {href: '#bar'}, ['Go to bar']),
        ]),
        tree('a', {href: '#baz'}, [
          tree('span', {}, [
            tree('strong', {}, ['Go to baz']),
          ]),
        ]),
      ]),
      container);
    assert.equal(
      '<div>' +
        '<div foo="foo"><a href="#bar">Go to bar</a></div>' +
        '<a href="#baz"><span><strong>Go to baz</strong></span></a>' +
      '</div>',
      container.innerHTML);
  });

  it('renders custom components', () => {
    const Count = ({ state }) => tree('span', {}, [`Count is ${state}`]);
    renderTree(
      tree(Count, {state: 10}),
      container);
    assert.equal(container.innerHTML, '<span>Count is 10</span>');
  });

  it('renders nested custom components', () => {
    const Count = ({ state }) => tree('span', {}, [`Count is ${state}`]);
    const Joiner = ({ stuff, things, state }) => tree('div', {}, [
      tree('span', {type: 'stuff'}, [stuff.join(', ')]),
      tree('strong', {type: 'things'}, [things.join('-')]),
      tree(Count, { state }),
    ]);
    renderTree(
      tree('div', {}, [
        tree(Joiner, {
          stuff: ['foo', 'bar', 'baz'],
          things: [1, 2, 3, 4, 5],
          state: 55,
        }),
        tree(Count, {state: 13}),
      ]),
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

  it('sets click handlers', () => {
    let clicked = false;
    const Button = ({ onClick }) => tree('button', { onClick }, ['Click me!']);
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
});
