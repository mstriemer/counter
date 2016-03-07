export function tree(component, props, ...children) {
  console.log(arguments);
  return { component, props, children };
}

function renderHtmlElement(tagName, attributes) {
  const el = document.createElement(tagName);
  Object.keys(attributes || {}).forEach((attr) => {
    if (attr === 'onClick') {
      el.addEventListener('click', attributes[attr]);
    } else {
      el.setAttribute(attr, attributes[attr]);
    }
  });
  return el;
}

function renderTextNode(text) {
  return document.createTextNode(text);
}

export function renderTree(rootTree, container) {
  let root = rootTree;
  while (typeof root.component !== 'string') {
    root = root.component(root.props, root.children);
  }
  const rootElement = renderHtmlElement(root.component, root.props);
  (root.children || []).forEach((childTree) => {
    if (typeof childTree !== 'object') {
      rootElement.appendChild(renderTextNode(childTree));
    } else {
      renderTree(childTree, rootElement);
    }
  });
  container.appendChild(rootElement);
}

function makeRenderer(app, store, container) {
  if (container.children.length !== 0) {
    throw new Error('Cannot render into non-empty container');
  }
  const { dispatch } = store;
  const trees = {};
  return () => {
    trees.next = tree(app, { dispatch, ...store.getState() });
    if (typeof trees.last === undefined) {
      trees.last = trees.next;
    }
    // eslint-disable-next-line no-param-reassign
    container.innerHTML = '';
    renderTree(trees.next, container);
  };
}

export function renderApp(app, store, container) {
  const render = makeRenderer(app, store, container);
  store.subscribe(render);
  render();
}
