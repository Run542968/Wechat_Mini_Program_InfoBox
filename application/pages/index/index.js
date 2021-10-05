// application/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PageCur: 'Home',
    // PageCur: 'Schedule',
    // PageCur: 'Mine',
    pageHome: "INFO盒子",
    pageSchedule: "计划",
    pageMine: "我的",
    userInfo: {}
  },
  toHome(e) {
    this.setData({
      PageCur: 'Home'
    })
  },
  toSchudule(e) {
    this.setData({
      PageCur: 'Schedule'
    })
  },
  toMine(e) {
    this.setData({
      PageCur: 'Mine'
    })
  }
})