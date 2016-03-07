export function tree(component, props, ...children) {
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

function expandCustomElements(rootTree) {
  if (typeof rootTree !== 'object') {
    return rootTree;
  }
  let root = rootTree;
  while (typeof root.component !== 'string') {
    root = root.component(root.props, root.children);
  }
  return Object.assign({}, root, {
    children: root.children.map((child) => expandCustomElements(child)),
  });
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

function renderNode(node) {
  const { component, props, children } = node;
  const root = renderHtmlElement(component, props);
  // eslint-disable-next-line no-param-reassign
  node.node = root;
  (children || []).forEach((child) => {
    if (typeof child !== 'object') {
      root.appendChild(renderTextNode(child));
    } else {
      root.appendChild(renderNode(child));
    }
  });
  return root;
}

function diffRenderTree(next, last, container) {
  if (next.component === last.component) {
    // eslint-disable-next-line no-param-reassign
    next.node = last.node;
    Object.keys(next.props || {}).forEach((attr) => {
      if (!last.hasOwnProperty(attr) || last.props[attr] !== next.props[attr]) {
        next.node.setAttribute(attr, next.props[attr]);
      }
    });
    // TODO: Remove attributes.
    for (let i = 0; i < next.children.length || i < last.children.length; i++) {
      const nextChild = next.children[i];
      const lastChild = last.children[i];
      if (typeof nextChild === 'object') {
        diffRenderTree(nextChild, lastChild || {}, next.node);
      } else if (typeof lastChild === 'object') {
        next.node.removeChild(lastChild.node);
      } else if (nextChild !== lastChild) {
        let inserted = false;
        const childNodes = next.node.childNodes;
        const nextNode = renderTextNode(nextChild);
        for (let j = 0; j < childNodes.length; j++) {
          if (childNodes[j].textContent === lastChild.toString()) {
            next.node.insertBefore(nextNode, childNodes[j]);
            // Remove j + 1 since we added one.
            next.node.removeChild(childNodes[j + 1]);
            inserted = true;
            break;
          }
        }
        if (!inserted) {
          next.node.appendChild(nextNode);
        }
      }
    }
  } else {
    // eslint-disable-next-line no-param-reassign
    next.node = renderNode({ ...next });
    if (last.node) {
      container.insertBefore(next.node, last.node);
      container.removeChild(last.node);
    } else {
      container.appendChild(next.node);
    }
  }
}

function makeRenderer(app, store, container) {
  if (container.children.length !== 0) {
    throw new Error('Cannot render into non-empty container');
  }
  const { dispatch } = store;
  let lastTree = {};
  let nextTree = {};
  return () => {
    nextTree = expandCustomElements(
      tree(app, { dispatch, ...store.getState() }));
    diffRenderTree(nextTree, lastTree, container);
    lastTree = nextTree;
  };
}

export function renderApp(app, store, container) {
  const render = makeRenderer(app, store, container);
  store.subscribe(render);
  render();
}
