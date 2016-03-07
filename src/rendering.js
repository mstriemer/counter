export function tree(component, props, children = []) {
  return { component, props, children };
}

function renderHtmlElement(tagName, attributes) {
  const el = document.createElement(tagName);
  Object.keys(attributes).forEach((attr) => {
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
  root.children.forEach((childTree) => {
    if (typeof childTree !== 'object') {
      rootElement.appendChild(renderTextNode(childTree));
    } else {
      renderTree(childTree, rootElement);
    }
  });
  container.appendChild(rootElement);
}
