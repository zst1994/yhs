var util = require("../../utils/util.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopsInfo: []
  },

  searchBlur(e) {
    var keyWord = e.detail.value;
    var location = wx.getStorageSync('location');
    if (location) {
      var lat = location.latitude;
      var lng = location.longitude;
      util.httpRequest({
        url: '/api/shops?lat=' + lat + "&lng=" + lng + "&keyword=" + keyWord,
        resData: {},
        success: (res) => {
          wx.setStorageSync('shopsInfo', res.shops);
          this.setData({
            shopsInfo: res.shops
          })
        },
        fail: (error) => {
          app.toast('请求失败，请稍后重试');
        }
      });
    }
  },

  checkShop(e) {
    var idx = e.currentTarget.dataset.idx;
    wx.reLaunch({
      url: '/pages/menu/menu?idx=' + idx
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var shopsInfo = wx.getStorageSync('shopsInfo');
    this.setData({
      shopsInfo
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