var server = "https://www.yihuasheng.net";

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

function httpRequest(obj) {
  var obj = obj || {};

  if (!obj.url) return wx.showToast({
    title: '请填写url',
    icon: 'none'
  });

  wx.getNetworkType({
    success: function (res) {
      // 返回网络类型, 有效值：
      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      var networkType = res.networkType;
      // console.log(networkType)
      if (networkType != 'none') {
        wx.request({
          url: (obj.server ? obj.server : server) + obj.url,
          method: obj.method ? obj.method : 'GET',
          data: obj.resData ? obj.resData : {},
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            obj.success && obj.success(res.data);
            try {
              wx.hideLoading()
            } catch (error) {};
          },
          fail: function (error) {
            obj.fail && obj.fail(error)
            try {
              wx.hideLoading()
            } catch (error) {};
          },
          complete: function (data) {
            obj.complete && obj.complete(data);
            try {
              wx.hideLoading()
            } catch (error) {};
          }
        })
      } else {
        try {
          wx.hideLoading()
        } catch (error) {};
        wx.showToast({
          title: '没联网',
          icon: 'none'
        })
      }
    }
  })
}

module.exports = {
  formatTime,
  httpRequest
}