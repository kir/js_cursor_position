if (!window.maxkir) maxkir = {};
maxkir.FF = /Firefox/i.test(navigator.userAgent);

// Unify access to computed styles (for IE)
if (typeof document.defaultView == 'undefined') {
  document.defaultView = {};
  document.defaultView.getComputedStyle = function(element){
    return element.currentStyle;
  }
}

// This class allows to obtain position of cursor in the text area
// The position can be calculated as cursorX/cursorY or
// pointX/pointY
// See getCursorCoordinates and getPixelCoordinates
maxkir.CursorPosition = function(element, padding) {
  this.element = element;
  this.padding = padding;

  var that = this;

  this.get_selection_range = function() {
    // thanks to http://the-stickman.com/web-development/javascript/finding-selection-cursor-position-in-a-textarea-in-internet-explorer/
    if( (typeof element.selectionStart == 'undefined') && document.selection ){
      // The current selection
      var range = document.selection.createRange();
      // We'll use this as a 'dummy'
      var stored_range = range.duplicate();
      // Select all text
      stored_range.moveToElementText( element );
      // Now move 'dummy' end point to end point of original range
      stored_range.setEndPoint( 'EndToEnd', range );
      // Now we can calculate start and end points
      element.selectionStart = stored_range.text.length - range.text.length;
      element.selectionEnd = element.selectionStart + range.text.length;
    }
    return [element.selectionStart, element.selectionEnd];
  };

  var clone_css_style = function(target, styleName) {
    var val = element.style[styleName];
    if (!val) {
      var css = document.defaultView.getComputedStyle(element, null);
      val = css ? css[styleName] : null;
    }
    if (val) {
      target.style[styleName] = val;
    }
  };

  this.get_string_metrics = function(s) {
    var widthElementId = "__widther";
    var div = document.getElementById(widthElementId);
    if (!div) {
      div = document.createElement("div");
      div.id = widthElementId;
      document.body.appendChild(div);

      div.style.position = 'absolute';
      div.style.left = '-10000px';
    }

    clone_css_style(div, 'fontSize');
    clone_css_style(div, 'fontFamily');
    clone_css_style(div, 'fontWeight');
    clone_css_style(div, 'fontVariant');
    clone_css_style(div, 'fontStyle');
    clone_css_style(div, 'textTransform');
    clone_css_style(div, 'lineHeight');

    div.style.width = '0';
    div.style.paddingLeft = that.padding + "px";

    div.innerHTML = s.replace(' ', "&nbsp;");
    div.style.width = 'auto';
    return [div.offsetWidth, div.offsetHeight];
  };

  var splitter = new maxkir.StringSplitter(function(s) {
    var metrics = that.get_string_metrics(s);
    //maxkir.info(s + " |||" + metrics)
    return metrics[0];
  });

  this.split_to_lines = function() {
    var innerAreaWidth = element.scrollWidth;
    if (maxkir.FF) {  // FF has some implicit additional padding
      innerAreaWidth -= 4;
    }

    var pos = that.get_selection_range()[0];
    return splitter.splitString(element.value.substr(0, pos), innerAreaWidth);
  };

};

maxkir.CursorPosition.prototype.getCursorCoordinates = function() {
  var lines = this.split_to_lines();
  return [lines[lines.length - 1].length, lines.length];
};

maxkir.CursorPosition.prototype.getPixelCoordinates = function() {
  var lines = this.split_to_lines();
  var m = this.get_string_metrics(lines[lines.length - 1]);
  var w = m[0];
  var h = m[1] * lines.length - this.element.scrollTop + this.padding;
  return [w, h];
};
