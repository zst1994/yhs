// components/bottomDialog/bottom-dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    hideModal: true, //模态框的状态  true-隐藏  false-显示
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 显示遮罩层 
    showModal() {
      this.setData({
        hideModal: false
      })
      var animation = wx.createAnimation({
        duration: 600, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快 
        timingFunction: 'ease', //动画的效果 默认值是linear 
      })
      this.animation = animation
      setTimeout(() => {
        this.fadeIn(); //调用显示动画 
      }, 200)
    },

    // 隐藏遮罩层 
    hideModal() {
      var animation = wx.createAnimation({
        duration: 200, //动画的持续时间 默认400ms 数值越大，动画越慢 数值越小，动画越快 
        timingFunction: 'ease', //动画的效果 默认值是linear 
      })
      this.animation = animation
      this.fadeDown(); //调用隐藏动画 
      setTimeout(() => {
        this.setData({
          hideModal: true,
        })
        this.triggerEvent("dialogStatus");

      }, 200) //先执行下滑动画，再隐藏模块 
    },

    //动画集 
    fadeIn: function () {
      this.animation.translateY(0).step()
      this.setData({
        animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性 
      })
    },
    
    fadeDown: function () {
      this.animation.translateY(300).step()
      this.setData({
        animationData: this.animation.export(),
      })
    },
  }
})