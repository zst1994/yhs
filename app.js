App({
  onLaunch() {
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userLocation"]) {
          
        } else {
          wx.getLocation({
            type: 'gcj02',
            altitude: "true",
            isHighAccuracy: true,
            success: (res) => {
              console.log(res);
              wx.setStorageSync('location', res);
              // const latitude = res.latitude
              // const longitude = res.longitude
              // const speed = res.speed
              // const accuracy = res.accuracy
              // wx.openLocation({
              //   latitude,
              //   longitude,
              //   scale: 18
              // })
            },
            fail: () => {
              wx.showModal({
                title: '提示',
                content: '如需使用易花生，请开启您手机中的定位授权，开启后请重新打开小程序',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        console.log(res.authSetting)
                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})