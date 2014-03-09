JavaScript cursor position in a textarea or input
=================================================

What
----
  To obtain the text cursor position in a `<textarea>` or an `<input>` text field.
  Cursor position is provided either in characters, or in pixels relative to top-left corner of the text area.

Why
---
  The library can be used for positioning of a completion popup window in a `<textarea>` or `<input>` text field right
  near the caret. Given that long text is wrapped in `<textarea>`s, the task is not very trivial.

How
---
  The library tries to model text wrapping in the textarea and to find out relative cursor position.
  The results are not 100% accurate, but really close to it. Tested against IE8+, Chrome, Opera, Firefox as of 2012.

### Usage

```js
var padding = 3;
var positioner = new maxkir.CursorPosition(textarea_element, padding);
alert(positioner.getCursorCoordinates());  // [x, y] position of cursor in textarea in characters
alert(positioner.getPixelCoordinates());   // [x, y] position of cursor in textarea in pixels
```
    
See also the functional test under [test/cursor_position_test.html]<test/cursor_position_test.html>

Dependencies
------------
None, plain JavaScript code.


--
Copyright (c) 2010-2012 Kirill Maximov, released under the MIT license
