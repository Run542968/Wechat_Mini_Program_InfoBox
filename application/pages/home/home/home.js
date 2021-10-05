// pages/home/home/home.js
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
    swiperImgUrls: [
      "https://wx1.sinaimg.cn/mw2000/c98047ccly1gqzl1sag11j21ps2g27pm.jpg",
      "https://wx1.sinaimg.cn/mw2000/c98047ccly1gqzl1t3ttyj21ps2g24qp.jpg",
      "https://wx1.sinaimg.cn/mw2000/c98047ccly1gqzl1tliptj21ps2g2b1q.jpg",
      "https://wx1.sinaimg.cn/mw2000/c98047ccly1gqzl1ueq3vj21ps2g2nm7.jpg",
      "https://wx1.sinaimg.cn/mw2000/c98047ccly1gqzl1utmbxj21pt2g2dw7.jpg",
      "https://wx1.sinaimg.cn/mw2000/c98047ccly1gqzl1vnclpj21pt2g24qp.jpg",
    ],
    swiperIndex: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickLecture: function () {
      wx.navigateTo({
        url: '/pages/home/Lecture/Lecture',
      })
    },
    clickCampus: function () {
      wx.navigateTo({
        url: '/pages/home/Campus/Campus',
      })
    },
    clickVolunteer: function () {
      wx.navigateTo({
        url: '/pages/home/Volunteer/Volunteer',
      })
    },
    clickOrganization: function () {
      wx.navigateTo({
        url: '/pages/home/Organization/Organization',
      })
    },
    swiperChange(e) {
      const that = this;
      that.setData({
        swiperIndex: e.detail.current,
      })
    }
  }
})