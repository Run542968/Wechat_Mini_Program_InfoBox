var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    information:null,
    ifLike:false,
    item_index:null,
    pageOrgIntroDetail:"组织详情",
    DBdoc:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取当前页面信息
    var item_index=options.item_index;
    var ItemInformation=app.globalData.organizationInformation[item_index];
    var docID=options.docID;
    if(ItemInformation.event.inputOrgActivityIntro1.length != 2){
      var intro1 =ItemInformation.event.inputOrgActivityIntro1.replace('\n', '#');
      var intro2 =ItemInformation.event.inputOrgActivityIntro2.replace('\n', '#');
      intro1 =intro1.split('#');
      intro2 =intro2.split('#');
      ItemInformation.event.inputOrgActivityIntro1 =intro1;
      ItemInformation.event.inputOrgActivityIntro2 =intro2;
    }
    this.setData({
      information:ItemInformation,
      item_index:item_index,
      DBdoc:docID
    })
    this.seekUser(ItemInformation.event.userList,app.globalData.openId)//查看是否进行了Like
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.seekUser(this.data.information.event.userList,app.globalData.openId)//查看是否进行了Like
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.cloud.database().collection('organzation_information').doc(this.data.DBdoc).get({
      success:res=>{
        console.log("OrganizationDetail调用get函数成功",res)
        this.setData({
          information:res.data
        })
        this.seekUser(res.data.event.userList,app.globalData.openId)//查看是否进行了Like
      },
      fail:res=>{
        console.log("OrganizationDetail调用get函数失败",res)
      }
    })
  },
//-----------自定义函数----------
  seekUser(userList,openId){//寻找数据库的userList表项中是否存在当前用户
    for(let i=0;i<userList.length;i++){
      if(userList[i]==openId){
        this.setData({
          ifLike:true
        })
      }
    }
  },

  //-----------事件点击函数-------------
  clickLike(e) {
    console.log(e)
    // var information=this.data.information;
    if (this.data.ifLike) { //ifLike==true,点击就要删除
      this.setData({ //本地删除
        ifLike: false
      })
      var userList = this.data.information.event.userList;
      for (let i = 0; i < userList.length; i++) {
        if (userList[i] == app.globalData.openId) {
          userList.splice(i, 1) //splice会直接修改根变量，也就是说把globalData中的变量内容也给删除了。因为js中数组属于引用赋值
        }
      }

      wx.cloud.callFunction({ //云端删除
        name: 'UpdateUserList-delete',
        data: {
          DBcollections: 'organzation_information',
          DBdoc: this.data.information._id,
          userOpenId: app.globalData.openId
          // userList:this.deleteUser(information.event.userList,app.globalData.openId)
        },
        success: res => {
          console.log("OrganizationDetail调用UpdateUserList-delete云函数成功", res)
        },
        fail: res => {
          console.log("OrganizationDetail调用UpdateUserList-delete云函数失败", res)
        }
      })
    } else {
      this.setData({ //本地添加
        ifLike: true
      })
      //直接修改全局变量进行本地更新
      var userList = this.data.information.event.userList;
      userList.push(app.globalData.openId);
      app.globalData.organizationInformation[this.data.item_index].event.userList = userList;

      wx.cloud.callFunction({ //云端添加
        name: 'UpdateUserList-add',
        data: {
          DBcollections: 'organzation_information',
          DBdoc: this.data.information._id,
          userOpenId: app.globalData.openId
        },
        success: res => {
          console.log("OrganizationDetail调用UpdateUserList-add云函数成功", res)
        },
        fail: res => {
          console.log("OrganizationDetail调用UpdateUserList-add云函数失败", res)
        }
      })
    }
  }
})