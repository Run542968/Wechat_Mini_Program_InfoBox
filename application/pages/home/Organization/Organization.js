var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    information:null,
    pageOrgIntro:"组织介绍",
    orgNumber:null,//入驻组织数量
    ifLike:[],
    orgIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var organizationInformation=app.globalData.organizationInformation;
    var ifLike=this.judgeIfLike(organizationInformation,app.globalData.openId);
    this.setData({
      information:organizationInformation,
      orgNumber:organizationInformation.length,
      ifLike:ifLike
    })
    console.log(organizationInformation)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var ifLike=this.judgeIfLike(app.globalData.organizationInformation,app.globalData.openId);
    this.setData({
      ifLike:ifLike
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      ifLike:[]
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.cloud.database().collection('organzation_information').get({
      success:res=>{
        console.log("Organization调用get函数成功",res)
        this.setData({
          information:res.data
        })
      },
      fail:res=>{
        console.log("Organization调用get函数失败",res)
      }
    })
  },

  judgeIfLike(organizationInformation, openID) { //查询出全局变量activityInformation中本openID选择添加日程的item，生成一个数组[0,1,0]
    let ifLike=[];
    for(let i=0;i<organizationInformation.length;i++){
      if(organizationInformation[i].event.userList.indexOf(openID)>-1){
        ifLike.push(1);
      }else{
        ifLike.push(0);
      }
    }
    return ifLike
  },
  //---------事件点击函数------------
  clickOrganization(e){
    var item_index=e.currentTarget.dataset.item_index;
    var docID=e.currentTarget.dataset.docid;
    wx.navigateTo({
      url:'./OrganizationDetail/OrganizationDetail?item_index='+item_index+"&docID="+docID
    })
  },
  clickOrgButton(e){
    var num = e.currentTarget.dataset.order
     this.setData({
       orgIndex:num
     })
  },
  clickLike(e) {
    var item_index=e.currentTarget.dataset.item_index;
    var docID=e.currentTarget.dataset.docid;

    if (this.data.ifLike[item_index]) { //ifLike==true,点击就要删除
      var ifLike=this.data.ifLike;
      ifLike[item_index]=0;
      this.setData({ //本地删除
        ifLike: ifLike
      })

      var userList = this.data.information[item_index].event.userList;
      for (let i = 0; i < userList.length; i++) {
        if (userList[i] == app.globalData.openId) {
          userList.splice(i, 1) //splice会直接修改根变量，也就是说把globalData中的变量内容也给删除了。因为js中数组属于引用赋值
        }
      }

      wx.cloud.callFunction({ //云端删除
        name: 'UpdateUserList-delete',
        data: {
          DBcollections: 'organzation_information',
          DBdoc: docID,
          userOpenId: app.globalData.openId
        },
        success: res => {
          console.log("Organization调用UpdateUserList-delete云函数成功", res)
        },
        fail: res => {
          console.log("Organization调用UpdateUserList-delete云函数失败", res)
        }
      })
    } else {
      var ifLike=this.data.ifLike;
      ifLike[item_index]=1;
      this.setData({ //本地添加
        ifLike: ifLike
      })
      //直接修改全局变量进行本地更新
      var userList = this.data.information[item_index].event.userList;
      userList.push(app.globalData.openId);
      app.globalData.organizationInformation[item_index].event.userList = userList;

      wx.cloud.callFunction({ //云端添加
        name: 'UpdateUserList-add',
        data: {
          DBcollections: 'organzation_information',
          DBdoc: docID,
          userOpenId: app.globalData.openId
        },
        success: res => {
          console.log("Organization调用UpdateUserList-add云函数成功", res)
        },
        fail: res => {
          console.log("Organization调用UpdateUserList-add云函数失败", res)
        }
      })
    }
  }
})