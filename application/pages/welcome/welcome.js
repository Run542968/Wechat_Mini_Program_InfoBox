// application/pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo:false,//只有成功获取到用户信息并且存到缓存，才能进入小程序
    ani1:null,
    ani2:null
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var animation = wx.createAnimation({
      duration: 4000,
      timingFunction: 'ease',
      delay: 500
    });
    animation.opacity(1).step()
    this.setData({
      ani1:  animation.export()
    })
    var animation2 = wx.createAnimation({
      duration: 5000,
      timingFunction: 'ease',
      delay: 2500
    });
    animation2.opacity(1).translate(0,-50).step()
    this.setData({
      ani2:  animation2.export()
    })
  },
  //-------------事件点击函数------------
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorage({//将当前用户昵称添加到本地缓存中
          data: res.userInfo,
          key: 'userInfo',
          success:res=>{
            console.log("把userInfo添加到缓存成功",res.data)
            this.setData({
              hasUserInfo:true
            })

          wx.redirectTo({
            url: '/pages/index/index',
          })
          },
          fail:res=>{
            console.log("把userInfo添加到缓存失败",res.data)
          }
        })
      }
    })
  },
  enterProgram(e){
    wx.redirectTo({
      url: '/pages/index/index',
    })
  }
})