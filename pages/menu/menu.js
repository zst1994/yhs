var util = require("../../utils/util.js");
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showaddproduct: false,
    allPrice: "0.00",
    deliver_fee_up: "0.00",
    allNum: 0,
    showIndex: -1,
    current: 0,
    shopsIndex: 0,
    checkIndex: 0,
    shop: {},
    hasSpecs: {},
    genres: [],
    products: [],
    shopsInfo: [],
  },

  cleanProductList() {
    this.data.products.forEach((e) => {
      e["addNum"] = 0;
    })

    this.setData({
      allPrice: "0.00",
      allNum: 0,
      products: this.data.products,
      deliver_fee_up: this.data.shop.deliver_fee_up.toFixed(2)
    })

    this.dialog.hideModal();
  },

  showAddProductList(e) {
    var showaddproduct = e.currentTarget.dataset.showaddproduct;
    this.setData({
      showaddproduct
    })
    this.dialog.showModal();
  },

  placeOrder() {
    console.log(1111111111);
  },

  specsLimit(e) {
    var price = e.currentTarget.dataset.price;
    var hasSpecs = this.data.hasSpecs
    hasSpecs.price = price;
    this.setData({
      hasSpecs
    })
  },

  hiden_dialog() {
    this.setData({
      hasSpecs: {},
      showaddproduct: false,
      showIndex: -1
    })
  },

  checkLimit(e) {
    var idx = e.currentTarget.dataset.idx;
    this.data.products[idx].specs.forEach((e) => {
      e.price = parseFloat(e.price).toFixed(2);
    })

    this.setData({
      showIndex: idx,
      hasSpecs: this.data.products[idx]
    })
    this.dialog.showModal();
  },

  previewImage() {
    wx.previewImage({
      current: this.data.products[this.data.showIndex].image, // 当前显示图片的http链接
      urls: [this.data.products[this.data.showIndex].image] // 需要预览的图片http链接列表
    })
  },

  lower(e) {
    var allNum = this.data.allNum > 0 ? this.data.allNum -= 1 : 0;
    if (allNum == 0) {
      this.hiden_dialog();
      this.dialog.hideModal();
    }

    if (!e.currentTarget.dataset.showspecs) {
      var idx = e.currentTarget.dataset.idx;
      var products = this.data.products;
      var allPrice = parseFloat(this.data.allPrice) > 0 ? (parseFloat(this.data.allPrice) - parseFloat(products[idx].price)).toFixed(2) : "0.00";
      products[idx].addNum = products[idx].addNum -= 1

      this.setData({
        allPrice,
        products,
        allNum,
        deliver_fee_up: (this.data.shop.deliver_fee_up - allPrice).toFixed(2)
      })
    } else {
      var hasSpecs = this.data.hasSpecs;
      var products = this.data.products;
      var allPrice = parseFloat(this.data.allPrice) > 0 ? (parseFloat(this.data.allPrice) - parseFloat(hasSpecs.price)).toFixed(2) : "0.00";

      hasSpecs.addNum = hasSpecs.addNum -= 1;
      products[this.data.showIndex] = hasSpecs;

      this.setData({
        allPrice,
        hasSpecs,
        products,
        allNum,
        deliver_fee_up: (this.data.shop.deliver_fee_up - allPrice).toFixed(2)
      })
    }
  },

  add(e) {
    if (!e.currentTarget.dataset.showspecs) {
      var idx = e.currentTarget.dataset.idx;
      var products = this.data.products;
      var allPrice = (parseFloat(this.data.allPrice) + parseFloat(products[idx].price)).toFixed(2);
      products[idx].addNum = products[idx].addNum += 1;

      this.setData({
        allPrice,
        products,
        allNum: this.data.allNum += 1,
        deliver_fee_up: (this.data.shop.deliver_fee_up - allPrice).toFixed(2)
      })
    } else {
      var hasSpecs = this.data.hasSpecs;
      var products = this.data.products;
      var allPrice = (parseFloat(this.data.allPrice) + parseFloat(hasSpecs.price)).toFixed(2);
      hasSpecs.addNum = hasSpecs.addNum += 1;
      products[this.data.showIndex] = hasSpecs;

      this.setData({
        allPrice,
        hasSpecs,
        products,
        allNum: this.data.allNum += 1,
        deliver_fee_up: (this.data.shop.deliver_fee_up - allPrice).toFixed(2)
      })
    }
  },

  showProduct(e) {
    var idx = e.currentTarget.dataset.idx;
    this.setData({
      showIndex: idx
    })
    this.dialog.showModal();
  },

  shopMess() {
    this.setData({
      current: this.data.current ? 0 : 1
    })
  },

  tapTypeIndex(e) {
    var idx = e.currentTarget.dataset.idx;
    this.getShopProductList(idx);
    this.setData({
      checkIndex: idx
    })
  },

  getShops() {
    var location = wx.getStorageSync('location');
    if (location) {
      var lat = location.latitude;
      var lng = location.longitude;

      util.httpRequest({
        url: '/api/shops?lat=' + lat + "&lng=" + lng,
        resData: {},
        success: (res) => {
          wx.setStorageSync('shopsInfo', res.shops);
          this.setData({
            shopsInfo: res.shops
          })
          this.getShopProductList("");
        },
        fail: (error) => {
          app.toast('请求失败，请稍后重试');
        }
      });
    }
  },

  getShopProductList(genre_id) {
    var shopsInfo = this.data.shopsInfo;
    var shopsIndex = this.data.shopsIndex;
    var identifier = shopsInfo[shopsIndex].identifier;
    util.httpRequest({
      url: '/api/shops/get_products?shop_id=' + identifier + '&genre_id=' + genre_id,
      resData: {},
      success: (res) => {
        var genre = res.genre;
        var genres = res.genres;
        var products = res.products;
        var shop = res.shop;

        if (products.length > 0) {
          products.forEach((e) => {
            e["price"] = parseFloat(e.price).toFixed(2);
            e["addNum"] = 0;
          })

          shop["deliver_fee_up"] = parseFloat(parseFloat(shop.deliver_fee_up).toFixed(2));

          this.setData({
            genres,
            products,
            shop,
            checkIndex: genre[0],
            deliver_fee_up: (shop.deliver_fee_up - this.data.allPrice).toFixed(2)
          })
        } else {
          wx.showToast({
            title: '门店暂无商品',
            icon: 'none',
            success: () => {
              this.setData({
                genres,
                products,
                shop,
              })
            }
          })
        }
      },
      fail: (error) => {
        app.toast('请求失败，请稍后重试');
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.idx) {
      this.setData({
        shopsIndex: options.idx
      })
    }
    this.getShops();
    this.dialog = this.selectComponent("#dialog");
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