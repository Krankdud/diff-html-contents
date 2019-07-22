# diff-html-contents

Shows the differences in text contents of two DOM trees. This uses
[virtual-dom](https://github.com/Matt-Esch/virtual-dom) to create
virtual DOMs of the trees, and utilizes the diffing and patching
abilities of virtual-dom to show the differences in text while
maintaining the structure of the document.

The patching process wraps editted text in the CSS classes
`diff-added` and `diff-removed`.

## API

```javascript
diffHTML(original, modified);
```

Returns a DOM node that shows the differences in text between the
two provided trees.

```javascript
diffHTMLStrings(original, modified);
```

Returns a DOM node that shows the differences in text between the
two provided trees. The trees are passed in as strings.

## Dependencies

- [virtual-dom](https://github.com/Matt-Esch/virtual-dom)
- [html-to-vdom](https://github.com/TimBeyer/html-to-vdom)
- [vdom-virtualize](https://github.com/marcelklehr/vdom-virtualize)
- [diff](https://github.com/kpdecker/jsdiff)
- [lodash](https://lodash.com/)

## Todo

- [ ] Create a npm package
- [ ] Unit tests
- [ ] Use a key instead of id for supporting reordering elements
