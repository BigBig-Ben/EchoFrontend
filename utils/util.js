const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getzf(num){  
   if(parseInt(num) < 10){  
       num = '0'+num;  
   }  
   return num;  
}

const ftime = element => {
  var etime = Date.parse(new Date())
  var time = element.Time
  var usedTime = etime - time;
  var days = Math.floor(usedTime / (24 * 3600 * 1000));
  var leave1 = usedTime % (24 * 3600 * 1000);
  var hours = Math.floor(leave1 / (3600 * 1000));
  var leave2 = leave1 % (3600 * 1000);
  var minutes = Math.floor(leave2 / (60 * 1000));
  var leave3 = leave2 % (60 * 1000);
  var second = Math.floor(leave3 / 1000)
  if(days<=6) {
    if(days>0) {
      days += 1
      time = days + "天前"
    } else if(hours>0) {
      hours += 1
      time = hours + "小时前"
    } else if(minutes>0) {
      minutes += 1
      time = minutes + "分钟前"
    } else {
      time = second + "秒前"
    }
  } else {
    var oDate = new Date(str),  
    oYear = oDate.getFullYear(),  
    oMonth = oDate.getMonth()+1,  
    oDay = oDate.getDate()
    time = getzf(oMonth) +'-'+ getzf(oDay)
    if(oYear!=(new Date()).getFullYear) {
      time = oYear +'-'+ time
    }
  }
  element.Time = time
  return element
}

const ftimes = arr => {
  if(arr.length==0) return arr
  arr.forEach(element=>{
    element = ftime(element)
  })
  return arr
}

const ftag = element => {
  if(element.TagStr.length==0) {
    element.TagStr = []
  } else {
    element.TagStr = element.TagStr.split(' ')
  }
  return element
}

const ftags = arr => {
  if(arr.length==0) return arr
  arr.forEach(element=>{
    element = ftag(element)
  })
  return arr
}

module.exports = {
  formatTime: formatTime,
  ftime: ftime,
  ftimes: ftimes,
  ftag: ftag,
  ftags: ftags
}