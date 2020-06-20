// pages/login/login.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden_flag: true,
  },
  iconToggle: function() {
    var _hidden_flag = !this.data.hidden_flag
    this.setData({
      hidden_flag: _hidden_flag
    })
  },
  submit: function(e) {
    let data = {
      UserId : wx.getStorageSync("UserId"),
      gender : this.data.gender,
      description: this.data.motto,
      icon: this.data.icon
    }
    console.log(data)
    wx.request({
      url: app.globalData.URL+'/addUser',
      data: data,
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.switchTab({ url: "/pages/home/home" })
      }
    })
  },
  chooseIcon: function(e) {
    this.setData({
      icon: e.currentTarget.dataset.icon,
      hidden_flag: true
    })
  },
  input: function (e) {
    this.setData({
      motto: e.detail.value
    })
  },
  changeGender: function(e) {
    this.setData({
      gender: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.URL+'/getIcons ',
      method: 'GET',
      dataType: 'json',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        that.setData({
          icons: res.data
        })
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