import applyProperties from "virtual-dom/vdom/apply-properties";
import isWidget from "virtual-dom/vnode/is-widget";
import VPatch from "virtual-dom/vnode/vpatch";
import updateWidget from "virtual-dom/vdom/update-widget";
import { diffWords } from "diff";

import "./diff.css";

export default function applyPatch(vpatch, domNode, renderOptions) {
  var type = vpatch.type;
  var vNode = vpatch.vNode;
  var patch = vpatch.patch;

  switch (type) {
    case VPatch.REMOVE:
      return removeNode(domNode, vNode);
    case VPatch.INSERT:
      return insertNode(domNode, patch, renderOptions);
    case VPatch.VTEXT:
      return stringPatch(domNode, vNode, patch, renderOptions);
    case VPatch.WIDGET:
      return widgetPatch(domNode, vNode, patch, renderOptions);
    case VPatch.VNODE:
      return vNodePatch(domNode, vNode, patch, renderOptions);
    case VPatch.ORDER:
      reorderChildren(domNode, patch);
      return domNode;
    case VPatch.PROPS:
      applyProperties(domNode, patch, vNode.properties);
      return domNode;
    case VPatch.THUNK:
      return replaceRoot(
        domNode,
        renderOptions.patch(domNode, patch, renderOptions)
      );
    default:
      return domNode;
  }
}

function removeNode(domNode, vNode) {
  domNode.classList.add("diff-removed");

  return domNode;
}

function insertNode(parentNode, vNode, renderOptions) {
  var newNode = renderOptions.render(vNode, renderOptions);
  if (newNode.nodeName !== "#text") {
    newNode.classList.add("diff-added");
  }

  if (parentNode) {
    parentNode.appendChild(newNode);
  }

  return parentNode;
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
  var newNode;

  if (domNode.nodeType === 3) {
    let parentNode = domNode.parentNode;
    newNode = document.createElement("span");

    let diff = diffWords(domNode.textContent, vText.text);
    diff.forEach(function(part) {
      let span = document.createElement("span");
      if (part.added) {
        span.classList.add("diff-added");
      } else if (part.removed) {
        span.classList.add("diff-removed");
      }
      span.textContent = part.value;
      newNode.appendChild(span);
    });

    parentNode.replaceChild(newNode, domNode);
  } else {
    var parentNode = domNode.parentNode;
    newNode = renderOptions.render(vText, renderOptions);

    if (parentNode && newNode !== domNode) {
      parentNode.replaceChild(newNode, domNode);
    }
  }

  return newNode;
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
  var updating = updateWidget(leftVNode, widget);
  var newNode;

  if (updating) {
    newNode = widget.update(leftVNode, domNode) || domNode;
  } else {
    newNode = renderOptions.render(widget, renderOptions);
  }

  var parentNode = domNode.parentNode;

  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode);
  }

  if (!updating) {
    destroyWidget(domNode, leftVNode);
  }

  return newNode;
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
  var parentNode = domNode.parentNode;
  var newNode = renderOptions.render(vNode, renderOptions);

  if (parentNode && newNode !== domNode) {
    parentNode.replaceChild(newNode, domNode);
  }

  return newNode;
}

function destroyWidget(domNode, w) {
  if (typeof w.destroy === "function" && isWidget(w)) {
    w.destroy(domNode);
  }
}

function reorderChildren(domNode, moves) {
  var childNodes = domNode.childNodes;
  var keyMap = {};
  var node;
  var remove;
  var insert;

  for (var i = 0; i < moves.removes.length; i++) {
    remove = moves.removes[i];
    node = childNodes[remove.from];
    if (remove.key) {
      keyMap[remove.key] = node;
      domNode.removeChild(node);
    } else {
      node.classList.add("diff-removed");
    }
  }

  var length = childNodes.length;
  for (var j = 0; j < moves.inserts.length; j++) {
    insert = moves.inserts[j];
    node = keyMap[insert.key];
    // this is the weirdest bug i've ever seen in webkit
    domNode.insertBefore(
      node,
      insert.to >= length++ ? null : childNodes[insert.to]
    );
  }
}

function replaceRoot(oldRoot, newRoot) {
  if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
    oldRoot.parentNode.replaceChild(newRoot, oldRoot);
  }

  return newRoot;
}
