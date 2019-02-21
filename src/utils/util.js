/**
 * Created by common on 2017/8/10.
 */

import moment from "moment";

/**
 * 解析url参数
 * @param {String} str url
 * @returns {Array} 参数列表
 */
function parseQueryString(str) {
  var reg = /(([^?&=]+)(?:=([^?&=]*))*)/g;
  var result = {};
  var match;
  var key;
  var value;
  while ((match = reg.exec(str))) {
    key = match[2];
    value = match[3] || "";
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
  if (param == null) return "";
  var paramStr = "";
  var t = typeof param;
  if (t == "string" || t == "number" || t == "boolean") {
    paramStr +=
      "&" +
      key +
      "=" +
      (encode == null || encode ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k =
        key == null
          ? i
          : key + (param instanceof Array ? "[" + i + "]" : "." + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
}

/**
 * 取任意级别city选项
 * @param {String} childFieldName 城市子数组字段名
 */
function getSomeCitys(childFieldName) {
  /**
   * @param {Array} cityOptions 城市选项
   * @param {Number} limit 取到第几层
   * @param {Number} deep 当前层数
   */
  return function getSomeCitysInner(cityOptions, limit, deep = 0) {
    cityOptions = cityOptions || [];
    deep++;
    const converted = cityOptions.map(item => {
      const res = {};
      for (const key of Object.keys(item)) {
        if (key !== childFieldName) {
          res[key] = item[key];
        }
      }
      if (deep < limit) {
        res[childFieldName] = getSomeCitysInner(
          item[childFieldName],
          limit,
          deep
        );
      }
      return res;
    });
    return converted;
  };
}

/**
 * 扁平化层级选项
 * @param {Array} data 多层数据
 * @param {String} childFieldName 子数组字段名
 */
function flatHierarchyOptions(data, childFieldName) {
  const flatedData = [];
  function hierarchy(data) {
    data = data || [];
    for (const item of data) {
      flatedData.push(item);
      const childItems = item[childFieldName];
      if (childItems) {
        delete item[childFieldName];
        hierarchy(childItems);
      }
    }
  }
  data = JSON.parse(JSON.stringify(data));
  hierarchy(data, childFieldName);
  return flatedData;
}

export {
  getSomeCitys,
  flatHierarchyOptions,
  parseQueryString,
  urlEncode,
  disabledEndDate,
  disabledStartDate
};
