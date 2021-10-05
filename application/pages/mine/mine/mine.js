// pages/mine/mine/mine.js
var app = getApp()
Component({
  lifetimes: {
    attached: function () {
      this.setData({
        openId: app.globalData.openId
      })
      wx.getStorage({ //查看本地缓存是否有当前用户信息(头像，昵称),如果有就直接使用，没有就重新登录
        key: 'userInfo',
        success: res => {
          console.log("缓存中拉取userInfo成功", res.data)
          this.setData({
            userInfo: res.data,
            hasUserInfo: true
          })
        },
        fail: res => {
          console.log("缓存中拉取userInfo成功", res.data)
        }
      })
      this.seekUser(app.globalData.authorUserList, app.globalData.openId) //判断是否为授权用户
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    openId: null,
    userInfo: {}, //这里的usrInfo和云函数返回的不一样,这里是昵称等信息
    hasUserInfo: false,
    // canIUseGetUserProfile: false,
    ifAuthor: false //是否进行了管理员授权
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getUserProfile(e) {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          wx.setStorage({ //将当前用户昵称添加到本地缓存中
            data: res.userInfo,
            key: 'userInfo',
            success: res => {
              console.log("把userInfo添加到缓存成功", res.data)
            },
            fail: res => {
              console.log("把userInfo添加到缓存成功", res.data)
            }
          })
          // this.addUserList(res.userInfo) //将当前用户昵称添加到数据库"userList"表中
        }
      })
    },
    seekUser(userList, openId) { //寻找数据库的userList表项中是否存在当前用户
      for (let i = 0; i < userList.length; i++) {
        if (userList[i] == openId) {
          this.setData({
            ifAuthor: true
          })
        }
      }
    },
    clickUsertutorial: function (e) {
      wx.navigateTo({
        url: '/pages/mine/Usertutorial/Usertutorial',
      })
    },
    clickFeedback: function (e) {
      wx.navigateTo({
        url: '/pages/mine/Feedback/Feedback',
      })
    },
    clickLikeOrg: function (e) {
      wx.navigateTo({
        url: '/pages/mine/LikeOrganization/LikeOrganization',
      })
    },
    clickAboutus: function (e) {
      wx.navigateTo({
        url: '/pages/mine/Aboutus/Aboutus',
      })
    },
    clickAdd: function (events) {
      wx.navigateTo({
        url: '/pages/mine/Add/Add'
      })
    },
    clickAddOrg(e) {
      wx.navigateTo({
        url: '/pages/mine/AddOrganization/AddOrganization',
      })
    },
    clickDelete(e){
      wx.navigateTo({
        url: '/pages/mine/Delete/Delete',
      })
    }
  }
})