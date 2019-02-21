/**
 * Created by common on 2017/8/3.
 */

/**
 * 获取元素高度
 * @returns {number}
 */
export function getDocumentHeight() {
  const body = document.body;
  const html = document.documentElement;
  return Math.max(
    body.offsetHeight,
    html.offsetHeight,
  );
}

/**
 * 获取元素的高度
 * @returns {number}
 */
export function height(el) {
  let styles = undefined;
  if (window.getComputedStyle) {
    styles = window.getComputedStyle(el);
  }
  else {
    styles = window.currentStyle;
  }
  const height = el.offsetHeight;
  const borderTopWidth = parseFloat(styles.borderTopWidth);
  const borderBottomWidth = parseFloat(styles.borderBottomWidth);
  const paddingTop = parseFloat(styles.paddingTop);
  const paddingBottom = parseFloat(styles.paddingBottom);
  return height - borderTopWidth - borderBottomWidth - paddingTop - paddingBottom;
}

/**
 * 获取元素的宽度
 * @param el
 * @returns {number}
 */
export function width(el) {
  let styles = undefined;
  if (window.getComputedStyle) {
    styles = window.getComputedStyle(el);
  } else {
    styles = el.currentStyle;
  }
  const width = el.offsetWidth;
  const borderLeftWidth = parseFloat(styles.borderLeftWidth);
  const borderRightWidth = parseFloat(styles.borderRightWidth);
  const paddingLeft = parseFloat(styles.paddingLeft);
  const paddingRight = parseFloat(styles.paddingRight);
  return width - borderLeftWidth - borderRightWidth - paddingLeft - paddingRight;
}

/**
 * 设置元素样式
 * @param el
 * @param cssName
 * @param value
 * @returns {*}
 */
export function style(el, cssName, value) {
  if (cssName && typeof cssName === 'string' && value === undefined) {
    if (window.getComputedStyle) {
      return window.getComputedStyle(el, "")[cssName];
    }
    else {
      return el.currentStyle[cssName];
    }
  }
  if (typeof cssName === 'string' && value) {
    el.style[cssName] = value;
  } else if (typeof cssName === 'object') {
    for (const key in cssName) {
      if (cssName.hasOwnProperty(key)) {
        el.style[key] = cssName[key];
      }
    }
  }
}

/**
 * 获取窗口滚动条高度
 */
export function getScrollTop() {
  var scrollTop = 0;
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop;
  }
  else if (document.body) {
    scrollTop = document.body.scrollTop;
  }
  return scrollTop;
}

export function getElementLeft(element) {
  var actualLeft = element.offsetLeft;
  var current = element.offsetParent;
  while (current !== null) {
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }
  return actualLeft;
}

export function getElementTop(element) {
  var actualTop = element.offsetTop;
  var current = element.offsetParent;
  while (current !== null) {
    actualTop += current.offsetTop;
    current = current.offsetParent;
  }
  return actualTop;
}
