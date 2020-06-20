// pages/dateDetail/dateDetail.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOwner: false,
    users: [{
      UserId: 1,
      UserIcon: '../../imgs/boy.png',
      UserGender: 1,
    },{
      UserId: 2,
      UserIcon: '../../imgs/boy.png',
      UserGender: 2,
    },{
      UserId: 3,
      UserIcon: '../../imgs/boy.png',
      UserGender: 0,
    }],
    date: {
      DateDesc: '涉及到了卡了',
      DateImgs:[
        '../../imgs/1.png',
        '../../imgs/2.png'
      ],
      DateTime: '1小时前',
      MaleNum: 4,
      FemaleNum: 2,
      Location: {
        Name: '留下路288号',
        Latitude: 30.274632,
        Longitude: 120.15697,
      },

    },
    discussions: [{
      UserIcon: '../../imgs/boy.png',
      UserName: '局长',
      Time: '1小时前',
      Desc: '灰色空间的贺卡收到会计核算电话卡是',
    },{
      UserIcon: '../../imgs/boy.png',
      UserName: 'wwb',
      Time: '1小时前',
      Desc: '灰色空间的贺卡收到会计核算电话卡是',
    },{
      UserIcon: '../../imgs/boy.png',
      UserName: '张三',
      Time: '1小时前',
      Desc: '灰色空间的贺卡收到会计核算电话卡是',
    }]
  },
  fusers: function() {
    var users = this.data.users
    var hasMaleNum = 0
    var hasFemaleNum = 0
    var UserId = wx.getStorageSync("UserId")
    var DateHost = this.data.date.DateHost
    var _hasJoined = false
    var _hostIndex
    for(var i=0;i<users.length;i++) {
      var user = users[i]
      if(UserId==user.UserId) {
        _hasJoined = true
      }
      if(DateHost==user.UserId) {
        _hostIndex = i
      }
      if(user.UserGender==1) {
        hasMaleNum += 1
      }
      if(user.UserGender==0) {
        hasFemaleNum += 1
      }
    }
    var MaleNum = this.data.date.MaleNum
    var FemaleNum = this.data.date.FemaleNum
    var hasNum = MaleNum + FemaleNum - users.length
    console.log(hasNum)
    MaleNum -= hasMaleNum
    FemaleNum -= hasFemaleNum
    var _UserGender = 0
    if(FemaleNum==0) {
      _UserGender = 1
    } else if(MaleNum) {
      _UserGender = 2
    }
    for(var i=0;i<hasNum;i++) {
      users.push({
        UserIcon: '../../imgs/join.png',
        UserGender: _UserGender
      })
    }
    var host = users.splice(_hostIndex,1)
    users.unshift(host[0])
    var _isOwner = false
    if(UserId==host[0].UserId) {
      _isOwner = true
    }
    this.setData({
      isOwner: _isOwner,
      hasJoined: _hasJoined,
      users: users
    })
  },
  getOneDate: function() {
    var that = this
    wx.request({
      url: app.globalData.URL+'/getOneDate',
      data: {
        DateId: wx.getStorageSync('DateId')
      },
      method: 'POST',
      dataType: 'json',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res) {
        console.log(res)
        that.setData({
          users: res.data.Users,
          date: util.ftime(res.data.Date)
        })
        that.fusers()
      }
    });
  },
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;
    var imgList = event.currentTarget.dataset.list;
    console.log(src)
    console.log(imgList)
    wx.previewImage({
      current: src,
      urls: imgList
    })
  },
  showLocation: function() {
    var that = this
    wx.chooseLocation({
      latitude: that.data.date.Location.Latitude,
      longitude: that.data.date.Location.Longitude,
    })
  },
  want: function() {
    var that = this
    wx.request({
      url: app.globalData.URL+'/joinDate',
      data: {
        UserId: wx.getStorageSync('UserId'),
        DateId: wx.getStorageSync('DateId')
      },
      method: 'POST',
      dataType: 'json',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res) {
        var flag = res.data
        if(flag) {
          wx.showModal({
            title: '参加成功',
            showCancel: false,
            success: function (res) {
              that.onShow()
            }
          })
        } else {
          wx.showModal({
            title: '不符合资格',
            showCancel: false,
            success: function (res) {

            }
          })
        }
      }
    })
  },
  leave: function() {
    var that = this
    wx.request({
      url: app.globalData.URL+'/leaveDate',
      data: {
        UserId: wx.getStorageSync('UserId'),
        DateId: wx.getStorageSync('DateId')
      },
      method: 'POST',
      dataType: 'json',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res) {
        var flag = res.data
        if(flag) {
          if(that.data.isOwner) {
            wx.showModal({
              title: '已取消',
              showCancel: false,
              success: function (res) {
                wx.reLaunch({
                  url: '../date/date',
                })
              }
            })
          } else {
            wx.showModal({
              title: '已退出',
              showCancel: false,
              success: function (res) {
                that.onShow()
              }
            })
          }
        } else {
          wx.showModal({
            title: '操作失败',
            showCancel: false,
            success: function (res) {

            }
          })
        }
      }
    })
  },
  input: function (e) {
    this.setData({
      sendText: e.detail.value
    })
  },
  send: function() {
    var that = this
    wx.request({
      url: app.globalData.URL+'/addDiscussion',
      data: {
        UserId: wx.getStorageSync('UserId'),
        DateId: wx.getStorageSync('DateId'),
        DisDesc: that.data.sendText
      },
      method: 'POST',
      dataType: 'json',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res) {
        console.log(res.data)
        if (res.data.type == 'illegal') {
          wx.hideLoading()
          wx.showModal({
            title: '含有非法字符！',
            showCancel: false,
          })
        }
        else{
          wx.hideLoading()
          wx.showModal({
            title: '提交成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                that.onShow()
              }
            }
          })
        }
      }
    })
  },
  getDiscussions: function() {
    var that = this
    wx.request({
      url: app.globalData.URL+'/getDiscussions',
      data: {
        DateId: wx.getStorageSync('DateId')
      },
      method: 'POST',
      dataType: 'json',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res) {
        console.log(res)
        that.setData({
          discussions: util.ftimes(res.data)
        })
      }
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
    this.getOneDate()
    this.getDiscussions()
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