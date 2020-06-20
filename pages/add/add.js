// pages/add/add.js
var app = getApp()
Page({
  data: {
    img_url: [],
    VoiceDesc: ''
  },
  onLoad: function (options) {
    //
  },
  onShow: function() {
    var _select_tag = wx.getStorageSync('select_tag')
    if(!_select_tag) _select_tag = []
    this.setData({
      select_tag: _select_tag
    })
  },
  onUnload: function () {
    console.log(1)
    wx.reLaunch({
      url: '../home/home'
    })
  },
  tagg: function () {
    wx.navigateTo({
      url: '../tag/tag',
    })
  },
  input: function (e) {
    this.setData({
      VoiceDesc: e.detail.value
    })
    if (this.data.VoiceDesc == "") {
      //如果不为空，就返回true.
      this.setData({
        input: false
      });
    } 
    else {
      this.setData({
        input: true
      });
    }
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
  chooseImg: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        if (res.tempFilePaths.length > 0) {
          //图如果满了9张，不显示加图
          if (res.tempFilePaths.length == 9) {
            that.setData({
              hideAdd: 1
            })
          } else {
            that.setData({
              hideAdd: 0
            })
          }

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
  //发布按钮事件
  send: function () {
    wx.showLoading({
      title: '上传中',
    })
    this.img_upload()
  },
  //图片上传
  img_upload: function () {
    var that = this;
    var tagStr = this.ftag()
    var img_url = that.data.img_url;
    var img_url_ok = [];
    if (img_url.length==0) {
      var userid = wx.getStorageSync('UserId');
      var content = that.data.VoiceDesc;
      wx.request({
        url: app.globalData.URL+'/addVoice',
        data: {
          UserId: userid,
          VoiceImgs: img_url_ok,
          VoiceDesc: content,
          TagStr: tagStr
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
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
                  wx.setStorage({
                    key: 'select_tag',
                    data: ''
                  })
                  wx.reLaunch({
                    url: '../home/home',
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
          success: function (res) {
            img_url_ok.push(res.data)
            if (img_url_ok.length == img_url.length) {
              var userid = wx.getStorageSync('UserId');
              var content = that.data.VoiceDesc;
              wx.request({
                url: app.globalData.URL+'/addVoice',
                data: {
                  UserId: userid,
                  VoiceImgs: img_url_ok,
                  VoiceDesc: content,
                  TagStr: tagStr
                },
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
                          wx.setStorage({
                            key: 'select_tag',
                            data: ''
                          })
                          wx.reLaunch({
                            url: '../home/home',
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
  delete: function (e) {
    var index = e.currentTarget.dataset.index;
    var arr= this.data.select_tag;
    arr.splice(index,1)
    this.setData({
      select_tag: arr,
    })
  },
  ftag: function() {
    var tagStr = ''
    if(this.data.select_tag.length==0) return tagStr
    this.data.select_tag.forEach(element => {
      tagStr = tagStr + element.text + ' '
    });
    return tagStr.substr(0,tagStr.length-1)
  }
})