// components/tabBar/tabBar.js
Component({
  /**
   * 组件的方法列表
   */
  methods: {
    toHome: function () {
      wx.redirectTo({
        url: '/pages/home/home',
      })
    },
    toSchudule: function () {
      wx.redirectTo({
        url: '/pages/schudule/schudule',
      })
    },
    toMine: function () {
      wx.redirectTo({
        url: '/pages/mine/mine',
      })
    },
  }


})