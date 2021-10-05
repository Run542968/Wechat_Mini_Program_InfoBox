var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    information:null,
    ifSchedule:false,
    item_index:null,
    pageLectureDetail:"活动详情",
    DBdoc:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var item_index=options.item_index;
    var ItemInformation=app.globalData.activityInformation[item_index];
    var docID=options.docID;
    this.setData({
      information:ItemInformation,
      item_index:item_index,
      DBdoc:docID
    })
    this.seekUser(this.data.information.event.userList,app.globalData.openId)//查看是否进行了Schedule
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.seekUser(this.data.information.event.userList,app.globalData.openId)//查看是否进行了Schedule
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //页面显示的时候云函数拉取的数据只负责刷新ifSchedule，因为只有这个会发生修改，与全局量出现不同
    wx.cloud.database().collection('activity_information').doc(this.data.DBdoc).get({
      success:res=>{
        console.log("CampusDetail调用get函数成功",res)
        this.setData({
          information:res.data
        })
        this.seekUser(res.data.event.userList,app.globalData.openId)//查看是否进行了Schedule
      },
      fail:res=>{
        console.log("CampusDetail调用get函数失败",res)
      }
    })
  },
  //-----------自定义函数----------
  seekUser(userList, openId) { //寻找数据库的userList表项中是否存在当前用户
    for (let i = 0; i < userList.length; i++) {
      if (userList[i] == openId) {
        this.setData({
          ifSchedule: true
        })
      }
    }
  },
  //----------事件点击函数----------
  clickSchedule(e) {
    var that=this;
    //直接修改全局变量进行本地更新
    var userList=this.data.information.event.userList;
    userList.push(app.globalData.openId);
    app.globalData.activityInformation[this.data.item_index].event.userList=userList;
    that.setData({
      ifSchedule:true
    })
    //云端更新
    wx.cloud.callFunction({ //云端更新
      name: 'UpdateUserList-add',
      data: {
        DBcollections: 'activity_information',
        DBdoc: that.data.information._id,
        userOpenId: app.globalData.openId
      },
      success: res => {
        console.log("CampusDetail调用UpdateUserList-add云函数成功", res)
      },
      fail: res => {
        console.log("CampusDetail调用UpdateUserList-add云函数失败", res)
      }
    })
  }
})