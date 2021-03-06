// pages/date/date.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasChooseSeat: false,
    navSelect : 0,
    tags: [{
      id: 1,
      name: '学习'
    },{
      id: 2,
      name: '运动'
    }],
    dates: [{
      DateId: 2,
      TagId: 1,
      TagName: '学习',
      DateDesc: '西方谁上课的艰苦拉萨了',
      DateTime: '时间戳'
    }]
  },
  getTags: function(){
    console.log(1)
    var that = this
    wx.request({
      url: app.globalData.URL+'/getDateTags',
      method: 'GET',
      dataType: 'json',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.setData({
          tags: res.data
        })
      }
    })
  },
  getDates(e) {
    var that = this
    wx.request({
      url: app.globalData.URL+'/getDates',
      method: 'POST',
      dataType: 'json',
      data: {
        HasChooseSeat: that.data.hasChooseSeat,
        TagId: that.data.navSelect 
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        that.setData({
          dates: util.ftimes(res.data)
        })
      }
    })
  },
  myDate:function(){
    wx.navigateTo({
      url: '../myDate/myDate',  
    })
  },
  setDate:function(){
    wx.navigateTo({
      url: '../setDate/setDate',  
    })
  },
  changeHasSeat(e) {
    var _hasChooseSeat = this.data.hasChooseSeat
    this.setData({
      hasChooseSeat : !_hasChooseSeat
    })
    this.getDates()
  },
  chooseTag(e) {
    var tagId = e.currentTarget.dataset.id
    if(this.data.navSelect==tagId) {
      tagId = 0
    }
    this.setData({
      navSelect : tagId
    })
    this.getDates()
  },
  toDetail: function (e) {
    wx.setStorage({
      key: 'DateId',
      data: e.currentTarget.dataset.dateid,
    })
    wx.navigateTo({
      url: '../dateDetail/dateDetail',
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
    this.getTags()
    this.getDates()
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