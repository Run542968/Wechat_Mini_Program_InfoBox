var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    information:null,
    pageVolunteer:"志愿活动",
    ifSchedule:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var activityInformation=app.globalData.activityInformation;
    var ifSchedule=this.judgeIfSchedule(activityInformation,app.globalData.openId);
    this.setData({
      information:activityInformation,
      ifSchedule:ifSchedule
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var ifSchedule=this.judgeIfSchedule(app.globalData.activityInformation,app.globalData.openId);
    this.setData({
      ifSchedule:ifSchedule
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      ifSchedule:[]
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.cloud.database().collection('activity_information').get({
      success:res=>{
        console.log("Volunteer调用get函数成功",res)
        this.setData({
          information:res.data
        })
      },
      fail:res=>{
        console.log("Volunteer调用get函数失败",res)
      }
    })
  },

  judgeIfSchedule(activityInformation, openID) { //查询出全局变量activityInformation中本openID选择添加日程的item，生成一个数组[0,1,0]
    let ifSchedule = [];
    for (let i = 0; i < activityInformation.length; i++) {
      if (activityInformation[i].event.userList.indexOf(openID) > -1) {
        ifSchedule.push(1);
      } else {
        ifSchedule.push(0);
      }
    }
    return ifSchedule
  },
  //------------事件点击函数--------------
  clickVolunteer(e){
    var item_index=e.currentTarget.dataset.item_index;
    var docID=e.currentTarget.dataset.docid;
    wx.navigateTo({
      url: './VolunteerDetail/VolunteerDetail?item_index='+item_index+"&docID="+docID
    })
  },
  clickSchedule(e) {//添加日程
    var item_index=e.currentTarget.dataset.item_index;
    var docID=e.currentTarget.dataset.docid;
    //直接修改全局变量进行本地更新
    var userList=this.data.information[item_index].event.userList;
    userList.push(app.globalData.openId);
    app.globalData.activityInformation[item_index].event.userList=userList;

    var ifSchedule=this.data.ifSchedule;
    ifSchedule[item_index]=1;
    this.setData({
      ifSchedule:ifSchedule
    })
    //云端更新
    wx.cloud.callFunction({ //云端更新
      name: 'UpdateUserList-add',
      data: {
        DBcollections: 'activity_information',
        DBdoc: docID,
        userOpenId: app.globalData.openId
      },
      success: res => {
        console.log("Lecture调用UpdateUserList-add云函数成功", res)
      },
      fail: res => {
        console.log("Lecture调用UpdateUserList-add云函数失败", res)
      }
    })
  }
})