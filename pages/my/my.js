// pages/my/my.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgImg: '../../imgs/pic.png',
    hideFlag: true,
    animationData: {},
  },
  toDetail: function(e) {
    wx.setStorage({
      key: 'VoiceId',
      data: e.currentTarget.dataset.voiceid,
    })
    console.log(e.currentTarget)
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;
    var imgList = event.currentTarget.dataset.list;
    wx.previewImage({
      current: src,
      urls: imgList
    })
  },
  goSetting: function() {
    wx.navigateTo({
      url: '../setting/setting',
    })
  },
  chooseBg:function(e){
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'],
      success: function (res) {
        if (res.tempFilePaths.length > 0) {
          that.setData({
            bgImg: res.tempFilePaths[0]
          })
          wx.uploadFile({
            url: app.globalData.URL+'/addImg',
            filePath: res.tempFilePaths[0],
            name: 'file',
            success: function (res) {
              var ok_url = res.data
              wx.request({
                url: app.globalData.URL+'/setBg',
                data: {
                  UserId: wx.getStorageSync('UserId'),
                  BgImg: ok_url
                },
                method: 'POST',
                dataType: 'json',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {

                }
              })  
            }
          })  
        }
      }
    })
    this.hideModal()
  },
  mCancel: function () {
    var that = this;
    that.hideModal();
  },
  showModal: function () {
    var that = this;
    that.setData({
      hideFlag: false
    })
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    this.animation = animation;
    var time1 = setTimeout(function () {
      that.slideIn();
      clearTimeout(time1);
      time1 = null;
    }, 100)
  },
  hideModal: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })
    this.animation = animation
    that.slideDown();
    var time1 = setTimeout(function () {
      that.setData({
        hideFlag: true
      })
      clearTimeout(time1);
      time1 = null;
    }, 220)
    
  },
  slideIn: function () {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  slideDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  delete: function(e) {
    var that = this
    wx.showModal({
      title: '确认删除？',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.URL+'/deleteVoice',
            data: {
              VoiceId: e.currentTarget.dataset.voiceid
            },
            method: 'POST',
            dataType: 'json',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              var _voices = that.data.voices
              _voices.splice(e.currentTarget.dataset.index,1)
              that.setData({
                voices: _voices
              })
            }
          })
        }
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    let postdata = {
      "UserId": wx.getStorageSync("UserId")
    }
    wx.request({
      url: app.globalData.URL+'/getUserInfo',
      data: postdata,
      method: 'POST',
      dataType: 'json',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        let data=res.data;
        console.log(data)
        that.setData({
          icon: data.Icon,
          motto: data.Motto,
          bgImg: data.BgImg
        })
      } 
    })
    wx.request({
      url: app.globalData.URL+'/getUserVoices',
      data: postdata,
      method: 'POST',
      dataType: 'json',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        let data=res.data.Voices;
        data = util.ftimes(data)
        data = util.ftags(data)
        that.setData({
          voices: data
        })
      }
    })
    this.setData({
      hideFlag: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})