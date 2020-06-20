const app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    reCommentDesc : "",
    CommentHidden: false,
    flag: false
  },
  onShow: function () {
    var that = this;
    wx.request({
      url: app.globalData.URL+'/getOneVoice',
      data: {
        VoiceId: wx.getStorageSync('VoiceId'),
        UserId: wx.getStorageSync('UserId')
      },
      method: 'POST',
      dataType: 'json',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res) {
        console.log(res.data)
        var data = res.data
        data = util.ftime(data)
        data = util.ftag(data)
        that.setData({
          "voice": data
        })
      }
    });
    wx.request({
      url: app.globalData.URL+'/getVoiceComment',
      data: {
        VoiceId: wx.getStorageSync('VoiceId'),
        UserId: wx.getStorageSync('UserId')
      },
      method: 'POST',
      dataType: 'json',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res) {
        console.log(res)
        that.setData({
          'comment': util.ftimes(res.data)
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
  likeTap:function(e){
    var that = this
    var voice = that.data.voice
    var type = ''
    if(voice.VoiceHasLiked) {
      type = 'dislike'
      voice.VoiceHasLiked = false
      voice.VoiceLike -= 1
    } else {
      type = 'like'
      voice.VoiceHasLiked = true
      voice.VoiceLike += 1
    }
    that.setData({
      "voice": voice
    })
    wx.request({
      url: app.globalData.URL+'/VoiceLike',
      data: {
        "UserId": wx.getStorageSync('UserId'),
        "VoiceId": wx.getStorageSync('VoiceId'),
        "type":type
      },
      method: 'POST',
      dataType: 'json',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res) {}
    })
  },
  commentlikeTap: function (e) {
    var that=this;
    var recomment = that.data.comment;
    var index = e.currentTarget.dataset['index'];
    var _type = ''
    if (recomment[index].CommentHasLiked) {
      recomment[index].CommentLike -= 1;
      recomment[index].CommentHasLiked = false;
      _type = 'dislike'
    } else {
      recomment[index].CommentLike += 1;
      recomment[index].CommentHasLiked = true;
      _type = 'like'
    }
    this.setData({
      comment:recomment
    })
    wx.request({
      url: app.globalData.URL+'/CommentLike',
      data: {
        CommentId: recomment[index].CommentID,
        UserId: wx.getStorageSync('UserId'),
        type: _type
      },
      method: 'POST',
      dataType: 'json',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success:function(res) {}
    })
  },
  input:function(e){
    this.setData({
      reCommentDesc:e.detail.value
    })
  },
  fasong:function(){
    var that = this
    var commentedUser = that.data.voice.HostId
    var CommentType = "COMMENT"
    if(that.data.flag) {
      CommentType = "REPLY"
      commentedUser = that.data.comment[that.data.commentindex-1].UserId
    }
    wx.request({
      url: app.globalData.URL+'/addComment',
      data: {
        "UserId":wx.getStorageSync("UserId"),
        "CommentType": CommentType,
        "CommentDesc": that.data.reCommentDesc,
        "CommentedFloor": that.data.commentindex,
        "CommentedUser": commentedUser,
        "VoiceBelong": wx.getStorageSync('VoiceId'),
        "CommentNo":that.data.comment.length
      },
      method: 'POST',
      dataType: 'json',
      header:{
          "Content-Type": "application/x-www-form-urlencoded"
        },
      success:function (res) {
        that.setData({
          reCommentDesc: ''
        })
        that.onShow()
      }
    })
    
  },
  focus:function () {
    this.setData({
      CommentHidden:false,
      inputShowed: true,
      placeholder: "评论楼主",
      flag: false
    })
  },
  commentfocus: function (e) {
    var index = e.currentTarget.dataset.index + 1
    this.setData({
      CommentHidden: false,
      inputShowed: true,
      commentindex:index,
      placeholder: "回复" + index + "楼",
      flag: true
    })
  }
})
