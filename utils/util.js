// function formatTime(date) {
//   var year = date.getFullYear()
//   var month = date.getMonth() + 1
//   var day = date.getDate()

//   var hour = date.getHours()
//   var minute = date.getMinutes()
//   var second = date.getSeconds()


//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }
Date.prototype.Format = function (fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
function FormatTime(value) {
  if (value) {
    value = value.replace("/Date(", "").replace(")/", "");

    if (value.indexOf("+") > 0) {
      value = value.substring(0, value.indexOf("+"));
    }
    else if (value.indexOf("-") > 0) {
      value = value.substring(0, value.indexOf("-"));
    }

    var date = new Date(parseInt(value, 10));
    return date.Format("yyyy-MM-dd hh:mm:ss");
  }
  else
    return "";
}

function ForNowTime() {
  var value = new Date();
  if (value) {
    value = value.replace("/Date(", "").replace(")/", "");

    if (value.indexOf("+") > 0) {
      value = value.substring(0, value.indexOf("+"));
    }
    else if (value.indexOf("-") > 0) {
      value = value.substring(0, value.indexOf("-"));
    }

    var date = new Date(parseInt(value, 10));
    return date.Format("yyyy-MM-dd hh:mm:ss");
  }
  else
    return "";
}

function FormatDate(value) {
  if (value) {
    value = value.replace("/Date(", "").replace(")/", "");

    if (value.indexOf("+") > 0) {
      value = value.substring(0, value.indexOf("+"));
    }
    else if (value.indexOf("-") > 0) {
      value = value.substring(0, value.indexOf("-"));
    }

    var date = new Date(parseInt(value, 10));
    return date.Format("yyyy.MM.dd");
  }
  else
    return "";
}


function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//待支付订单倒计时
function PayFormat(second) {
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = Math.floor((second - hr * 3600) / 60);
  // 秒位
  var sec = (second - hr * 3600 - min * 60);
  var day = "";
  if (hr >= 24) {
    day = Math.floor(hr / 24);
    hr = hr - (day * 24);
    day += "天";
  }
  // console.log(min + ":" + sec);
  return min == 0 ? 1 : min;
}
// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function Seconds_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
  // 毫秒位，保留2位
  // var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
  var day = "";
  if (hr >= 24) {
    day = Math.floor(hr / 24);
    hr = hr - (day * 24);
    day += "天";
  }
  return day + hr + ":" + min + ":" + sec;
}
// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

function For_matTime(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return [year, month, day].map(For_matNumber).join('/') + ' ' + [hour, minute, second].map(For_matNumber).join(':')
}
function For_matNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function For_matTimeTwo(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

module.exports = {
  For_matTimeTwo: For_matTimeTwo,
  FormatTime: FormatTime,
  FormatDate: FormatDate,
  Seconds_format: Seconds_format,
  fill_zero_prefix: fill_zero_prefix,
  PayFormat:PayFormat,
  For_matTime: For_matTime,
  For_matNumber: For_matNumber,
  For_matTimeTwo: For_matTimeTwo,
}


