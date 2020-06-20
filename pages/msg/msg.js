// pages/msg/msg.js
var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navSelect: 'COMMENT',
    comments: [{
      Icon: '../../imgs/boy.png',
      Time: '1小时前',
      Name: 'wwb',
      Desc: '测试测试消息的'
    },{
      Icon: '../../imgs/boy.png',
      Time: '1小时前',
      Name: 'wwb',
      Desc: '测试测试消息的'
    }],
    likes: [{
      Icon: '../../imgs/boy.png',
      Time: '1小时前',
      Name: 'wwb',
      type: 'COMMENT'
    },{
      Icon: '../../imgs/boy.png',
      Time: '1小时前',
      Name: 'wwb',
      type: 'VOICE'
    }]
  },
  select: function(e) {
    var id = e.currentTarget.dataset.id
    if (this.navSelect == id) return;
    this.setData({
      'navSelect': e.currentTarget.dataset.id
    })
    if(id=='COMMENT') this.getComment()
    if(id=='LIKE') this.getLike()
    if(id=='DATE') this.getDate()
  },
  getComment: function() {
    var that = this;
    wx.request({
      url: app.globalData.URL+'/getMsgComments',
      data: {
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
        that.setData({
          "comments": data
        })
      }
    })
  },
  getLike: function() {
    var that = this;
    wx.request({
      url: app.globalData.URL+'/getMsgLikes',
      data: {
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
        that.setData({
          "likes": data
        })
      }
    })
  },
  getDate: function() {
    var that = this;
    wx.request({
      url: app.globalData.URL+'/getMsgDates',
      data: {
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
        that.setData({
          "dates": data
        })
      }
    })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getComment()
    wx.removeTabBarBadge({
      index: 3
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