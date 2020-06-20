// pages/tag/tag.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    change:false,
    change1:true,
    inputValue:null,
    select_tag:[],

    history_tag:[{
      text:'#恋爱中如何保护自己？',
    },{ 
      text:'#单身',
    },{ 
      text:'#看淡',
    }],

    recommend_tag:[{
      text:'#爱而不得',
      color:'black',
    },{ 
      text:'#最不想打扰的人',
      color:'black',
    },{ 
      text:'#今天的哪个瞬间让你想要恋爱',
      color:'black',
    },{ 
      text:'#机动战士高达',
      color:'black',
    }]
  },
  search: function (e) {
    this.setData({
      change:true,
      change1: false,
      inputValue: "#"+e.detail.value
    })
  },
  creatTag: function (e) {
    console.log(1);
    var arr=this.data.select_tag;
    var item={text:null};
    item.text=this.data.inputValue;
    arr.push(item);
    this.setData({
      select_tag:arr,
      change:false,
      change1:true,
      value:null,
    })
  },
  delete: function (e) {
    var index = e.currentTarget.dataset.index;
    var arr= this.data.select_tag;
    arr.splice(index,1)
    this.setData({
      select_tag: arr,
    })
  },
  add: function (e) {
    var item = e.currentTarget.dataset.item;
    var arr= this.data.select_tag;
    var arr1=this.data.recommend_tag;
    var len=arr.length;
    var len1=arr1.length;
    var flag=0;
    for(var i = 0; i < len; i++) {
      if(arr[i].text==item.text)
        {
          for(var j = 0; j < len1; j++) {
            if(arr1[j].text==item.text)
            {
              arr1[j].color="balck";
              break;
            }
          }
          arr.splice(i,1);
          flag=1;
          break;
        }
    }
    if(flag==0)
    {
      for(var j = 0; j < len1; j++) {
        if(arr1[j].text==item.text)
        {
          arr1[j].color="rgb(60, 60, 60)";
          break;
        }
      };
      arr.push(item);
    }
    
    this.setData({
      select_tag: arr,
      recommend_tag:arr1,
    });
  },
  submit: function() {
    var that = this
    wx.setStorage({
      key: 'select_tag',
      data: that.data.select_tag
    })
    wx.navigateBack()
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