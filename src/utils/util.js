// 数组多项移除
export function removeItems(indexs, array) {
  if (indexs.length == 0) {
    return array;
  }
  array.splice(indexs[0], 1);
  indexs.splice(0, 1);
  return removeItems(indexs, array);
}

export function getScrollbarWidth() {
  var scrollP = document.createElement("p"),
    styles = {
      width: "100px",
      height: "100px",
      overflowY: "scroll"
    },
    i,
    scrollbarWidth;
  scrollP.setAttribute("id", "scrollP_frame");
  for (i in styles) scrollP.style[i] = styles[i];
  document.body.appendChild(scrollP);
  scrollbarWidth = scrollP.offsetWidth - scrollP.clientWidth;
  if (scrollP) {
    scrollP.parentNode.removeChild(scrollP);
  }
  return scrollbarWidth;
}

export var moment = require("moment");
moment.locale("zh-cn", {
  months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split(
    "_"
  ),
  monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
  weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
  weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split("_"),
  weekdaysMin: "日_一_二_三_四_五_六".split("_"),
  longDateFormat: {
    LT: "HH:mm",
    LTS: "HH:mm:ss",
    L: "YYYY年MMMD日",
    LL: "YYYY年MMMD日",
    LLL: "YYYY年MMMD日Ah点mm分",
    LLLL: "YYYY年MMMD日ddddAh点mm分",
    l: "YYYY年MMMD日",
    ll: "YYYY年MMMD日",
    lll: "YYYY年MMMD日 HH:mm",
    llll: "YYYY年MMMD日dddd HH:mm"
  },
  meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
  meridiemHour: function(hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === "凌晨" || meridiem === "早上" || meridiem === "上午") {
      return hour;
    } else if (meridiem === "下午" || meridiem === "晚上") {
      return hour + 12;
    } else {
      // '中午'
      return hour >= 11 ? hour : hour + 12;
    }
  },
  meridiem: function(hour, minute, isLower) {
    var hm = hour * 100 + minute;
    if (hm < 600) {
      return "凌晨";
    } else if (hm < 900) {
      return "早上";
    } else if (hm < 1130) {
      return "上午";
    } else if (hm < 1230) {
      return "中午";
    } else if (hm < 1800) {
      return "下午";
    } else {
      return "晚上";
    }
  },
  calendar: {
    sameDay: "[今天]LT",
    nextDay: "[明天]LT",
    nextWeek: "[下]ddddLT",
    lastDay: "[昨天]LT",
    lastWeek: "[上]ddddLT",
    sameElse: "L"
  },
  dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
  ordinal: function(number, period) {
    switch (period) {
      case "d":
      case "D":
      case "DDD":
        return number + "日";
      case "M":
        return number + "月";
      case "w":
      case "W":
        return number + "周";
      default:
        return number;
    }
  },
  relativeTime: {
    future: "%s内",
    past: "%s前",
    s: "几秒",
    m: "1 分钟",
    mm: "%d 分钟",
    h: "1 小时",
    hh: "%d 小时",
    d: "1 天",
    dd: "%d 天",
    M: "1 个月",
    MM: "%d 个月",
    y: "1 年",
    yy: "%d 年"
  },
  week: {
    // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
    dow: 1, // Monday is the first day of the week.
    doy: 4 // The week that contains Jan 4th is the first week of the year.
  }
});

//过滤对象，用户向后台传参转换
export function filterObject(keyMaps, sourceObj) {
  let targetObj = {};
  for (const sourceKey of Object.keys(keyMaps)) {
    const targetFieldConfig = keyMaps[sourceKey];
    const targetKey = targetFieldConfig[0];
    const targetValueType = targetFieldConfig[1];
    if (!targetValueType) {
      //默认为String
      targetObj[targetKey] = String(sourceObj[sourceKey]);
    } else if (targetValueType === "int") {
      targetObj[targetKey] = parseInt(sourceObj[sourceKey]);
    }
  }
  return targetObj;
}

// a download url but not support IE9
export function downloadFile(data, filename, mime) {
  var blob = new Blob([data], { type: mime || "application/octet-stream" });
  if (typeof window.navigator.msSaveBlob !== "undefined") {
    // IE workaround for "HTML7007: One or more blob URLs were
    // revoked by closing the blob for which they were created.
    // These URLs will no longer resolve as the data backing
    // the URL has been freed."
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var blobURL = window.URL.createObjectURL(blob);
    var tempLink = document.createElement("a");
    tempLink.style.display = "none";
    tempLink.href = blobURL;
    tempLink.setAttribute("download", filename);

    // Safari thinks _blank anchor are pop ups. We only want to set _blank
    // target if the browser does not support the HTML5 download attribute.
    // This allows you to download files in desktop safari if pop up blocking
    // is enabled.
    if (typeof tempLink.download === "undefined") {
      tempLink.setAttribute("target", "_blank");
    }

    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }
}
