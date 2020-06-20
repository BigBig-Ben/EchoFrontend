// pages/home/home.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navSelect: "NEW"
  },
  
  getVoices: function() {
    var that = this;
    wx.request({
      url: app.globalData.URL+'/getSquareVoice',
      data: {
        SquareSort: that.data.navSelect,
        UserId: wx.getStorageSync('UserId')
      },
      method: 'POST',
      dataType: 'json',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data)
        var data = res.data
        data = util.ftimes(data)
        data = util.ftags(data)
        that.setData({
          "voices": data
        })
      }
    })
  },

  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;
    var imgList = event.currentTarget.dataset.list;
    wx.previewImage({
      current: src,
      urls: imgList
    })
  },

  select: function(e) {
    if (this.navSelect == e.currentTarget.dataset.id) return;
    this.setData({
      'navSelect': e.currentTarget.dataset.id
    })
    this.getVoices();
  },

  toDetail: function (e) {
    wx.setStorage({
      key: 'VoiceId',
      data: e.currentTarget.dataset.voiceid,
    })
    wx.navigateTo({
      url: '../detail/detail',
    })
  },

  star: function(e) {
    var that = this
    var voiceId = e.currentTarget.dataset.voiceid
    var voices = that.data.voices
    var type = ''
    voices.forEach(element => {
      if(element.VoiceId==voiceId) {
        if(element.HasLike) {
          element.HasLike = false
          element.VoiceLike -= 1
          type = 'dislike'
        } else {
          element.HasLike = true
          element.VoiceLike += 1
          type = 'like'
        }
        wx.request({
          url: app.globalData.URL+'/VoiceLike',
          data: {
            "UserId": wx.getStorageSync('UserId'),
            "VoiceId": element.VoiceId,
            "type":type
          },
          method: 'POST',
          dataType: 'json',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success:function(res) {}
        })
      }
    });
    that.setData({
      "voices": voices
    })
    
  },

  onLoad: function (options) {
    //this.getVoices();
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
    this.getVoices();
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