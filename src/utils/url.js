/**
 * Created by common on 2017/8/10.
 */

/**
 * 解析url参数
 * @param str
 * @returns {{}}
 */
function parseQueryString(str) {
  var reg = /(([^?&=]+)(?:=([^?&=]*))*)/g;
  var result = {};
  var match;
  var key;
  var value;
  while (match = reg.exec(str)) {
    key = match[2];
    value = match[3] || '';
    result[key] = decodeURIComponent(value);
  }
  return result;
}

/**
 * 参数对象转url参数
 * @param param
 * @param key
 * @param encode
 * @returns {string}
 */
function urlEncode(param, key, encode) {
  if (param == null) return '';
  var paramStr = '';
  var t = typeof (param);
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
};

export {
  parseQueryString,
  urlEncode
}
