// pages/setDate/setDate.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navSelect : 1,
    tags: [{
      id: 1,
      name: '学习'
    },{
      id: 2,
      name: '运动'
    }],
    img_url: [],
    VoiceDesc: '',
    Location: {
      'Name' : ''
    },
    MaleNum : 0,
    FemaleNum : 0
  },
  chooseImg: function () {
    var that = this;
    wx.chooseImage({
      count: 3, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        if (res.tempFilePaths.length > 0) {
          //把每次选择的图push进数组
          let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            img_url.push(res.tempFilePaths[i])
          }
          that.setData({
            img_url: img_url
          })
        }
      }
    })
  },
  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    let img_url = this.data.img_url;
    wx.previewImage({
      current: img_url[index],
      urls: img_url,
    })
  },
  deleteImg(e) {
    let _index = e.currentTarget.dataset.index;
    let img_url = this.data.img_url;
    img_url.splice(_index, 1);
    this.setData({
      img_url
    })
  },
  getLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          Location: {
            'Name' : res.name,
            'Latitude': res.latitude,
            'Longitude': res.longitude
          }
        })
      },
    })
  },
  subNum(e) {
    var _MaleNum = this.data.MaleNum
    var _FemaleNum = this.data.FemaleNum
    var gender = e.currentTarget.dataset.gender
    if(gender=='Male') {
      _MaleNum -= 1
      this.setData({
        'MaleNum' : _MaleNum
      })
    } else {
      _FemaleNum -= 1
      this.setData({
        'FemaleNum' : _FemaleNum
      })
    }
  },
  addNum(e) {
    var _MaleNum = this.data.MaleNum
    var _FemaleNum = this.data.FemaleNum
    var gender = e.currentTarget.dataset.gender
    if(gender=='Male') {
      _MaleNum += 1
      while(_FemaleNum+_MaleNum>6) {
        _FemaleNum -= 1
      }
      this.setData({
        MaleNum : _MaleNum,
        FemaleNum : _FemaleNum
      })
    } else {
      _FemaleNum += 1
      while(_FemaleNum+_MaleNum>6) {
        _MaleNum -= 1
      }
      this.setData({
        MaleNum : _MaleNum,
        FemaleNum : _FemaleNum
      })
    }
  },
  submit(e) {
    var that = this;
    var img_url = that.data.img_url;
    var img_url_ok = [];
    var userid = wx.getStorageSync('UserId');
    var _data = {
      UserId: userid,
      TagId: that.data.navSelect,
      DateImgs: img_url_ok,
      DateDesc: that.data.DateDesc,
      Location: that.data.Location, 
      MaleNum: that.data.MaleNum,
      FemaleNum: that.data.FemaleNum
    }
    if (img_url.length==0) {
      wx.request({
        url: app.globalData.URL+'/addDate',
        data: _data,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
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
                  wx.reLaunch({
                    url: '../date/date',
                  })
                }
              }
            })
          }
        }
      })
    } else {
      for (var i = 0; i < img_url.length; i++) {
        wx.uploadFile({
          url: app.globalData.URL+'/addImg',
          filePath: img_url[i],
          name: 'file',
          method: 'POST',
          success: function (res) {
            img_url_ok.push(res.data)
            if (img_url_ok.length == img_url.length) {
              _data.DateImgs = img_url_ok
              wx.request({
                url: app.globalData.URL+'/addDate',
                data: _data,
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                  if(res.data.type=='illegal')
                  {
                    wx.hideLoading()
                    wx.showModal({
                      title: '含有非法字符！',
                      showCancel: false,
                      })
                  }
                  else {
                    wx.hideLoading()
                    wx.showModal({
                      title: '提交成功',
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          wx.reLaunch({
                            url: '../date/date',
                          })
                        }
                      }
                    })
                  }
                }
              })
            }
          },
          fail: function (res) {
            console.log('上传失败')
          }
        })
      }
    }
  },
  getTags: function(){
    var that = this
    wx.request({
      url: app.globalData.URL+'/getDateTags',
      method: 'GET',
      dataType: 'json',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        that.setData({
          tags: res.data
        })
      }
    })
  },
  chooseTag(e) {
    var tagId = e.currentTarget.dataset.id
    this.setData({
      navSelect : tagId
    })
  },
  input: function (e) {
    this.setData({
      DateDesc: e.detail.value
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
    wx.reLaunch({
      url: '../date/date'
    })
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