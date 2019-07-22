import _ from "lodash";
import diff from "virtual-dom/diff";
import patch from "virtual-dom/patch";
import VNode from "virtual-dom/vnode/vnode";
import VText from "virtual-dom/vnode/vtext";
import virtualize from "vdom-virtualize";
import initConvertHTML from "html-to-vdom";

import patchRecursive from "./patch";

/**
 * Returns a DOM tree that shows the differences in the text content of the
 * passed in original and modified trees.
 * @param {Node} original
 * @param {Node} modified
 */
export default function diffHTML(original, modified) {
  let origVTree = virtualize(original);
  let modVTree = virtualize(modified);

  let patches = diff(origVTree, modVTree);

  const element = document.createElement("div");
  element.innerHTML = original;
  let newDOM = patch(element.firstChild, patches, { patch: patchRecursive });

  return newDOM;
}

/**
 * Returns a DOM tree that shows the differences in the text content of the
 * original and modified trees. The HTML for the trees are passed in as
 * strings.
 * @param {string} original
 * @param {string} modified
 */
export function diffHTMLStrings(original, modified) {
  let convertHTML = initConvertHTML({ VNode: VNode, VText: VText }).bind(null, {
    getVNodeKey: function(attributes) {
      return attributes.id;
    }
  });

  let origVTree = convertHTML(original);
  let modVTree = convertHTML(modified);

  let patches = diff(origVTree, modVTree);

  const element = document.createElement("div");
  element.innerHTML = original;
  let newDOM = patch(element.firstChild, patches, { patch: patchRecursive });

  return newDOM;
}
