App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: that.globalData.URL+'/login',
            data: {
              code: res.code
            },
            success: function(res1)
            {
              console.log(res1)
              wx.setStorageSync("UserId", res1.data.UserId)
              wx.request({
                url: that.globalData.URL+'/getMsgCnt',
                data: {
                  UserId: wx.getStorageSync('UserId')
                },
                method: 'POST',
                dataType: 'json',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function(res1)
                {
                  var cnt = res1.data.Count
                  if(cnt>0) {
                    wx.setTabBarBadge({
                      index: 3,
                      text: String(cnt)
                    })
                  }
                }
                
              })
              let flag = parseInt(res1.data.flag)
              console.log(flag)
              if(flag==1)
              {
                wx.switchTab({ 
                  url: "/pages/home/home", 
                })
              }
              else
              {
                console.log(111)
                wx.redirectTo({ url: '/pages/login/login' })
              }
            }
            
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  globalData: {
    // URL: 'http://192.168.123.164:8080/api'
    // URL: 'http://3p233v4064.qicp.vip/api'
    URL: 'http://121.89.204.192:8080/api'
  },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
