var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    information: null,
    ifLike:[],
    pageLecture:"关注组织",
    LikeOrgNumber:null//关注组织的数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var organizationInformation=app.globalData.organizationInformation
    var ifLike_LikeOrgNumber=this.judgeIfLike(organizationInformation,app.globalData.openId)
    this.setData({
      information:organizationInformation,
      ifLike:ifLike_LikeOrgNumber[0],
      LikeOrgNumber:ifLike_LikeOrgNumber[1]
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var ifLike_LikeOrgNumber=this.judgeIfLike(this.data.information,app.globalData.openId)
    this.setData({
      ifLike:ifLike_LikeOrgNumber[0],
      LikeOrgNumber:ifLike_LikeOrgNumber[1]
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
    const _ = wx.cloud.database().command
    wx.cloud.database().collection('organzation_information').where({
        'event.userList': _.all([app.globalData.openId])//查找存在该openId的数据记录
      })
      .get({
        success: res => {
          console.log("LikeOrganization调用where_get函数成功", res)
          var ifLike=[];
          for(let i=0;i<res.data.length;i++){
            ifLike.push(1)
          }
          this.setData({
            information: res.data,
            ifLike:ifLike
          })
        },
        fail: res => {
          console.log("LikeOrganization调用where_get函数失败", res)
        }
      })
  },
  //----------事件点击函数------------
  judgeIfLike(organizationInformation,openID){//查询出全局变量Organization中本openID选择添加日程的item，生成一个数组[0,1,0]
    let ifLike=[];
    let LikeOrgNumber=0;
    for(let i=0;i<organizationInformation.length;i++){
      if(organizationInformation[i].event.userList.indexOf(openID)>-1){
        ifLike.push(1);
        LikeOrgNumber++;
      }else{
        ifLike.push(0);
      }
    }
    return [ifLike,LikeOrgNumber]
  },
  clickOrganization(e){
    var item_index=e.currentTarget.dataset.item_index;
    var docID=e.currentTarget.dataset.docid;
    wx.navigateTo({
      url:'../../home/Organization/OrganizationDetail/OrganizationDetail?item_index='+item_index+"&docID="+docID
    })
  },
  clickLike(e) {
    var item_index=e.currentTarget.dataset.item_index;
    var docID=e.currentTarget.dataset.docid;

    var LikeOrgNumber=this.data.LikeOrgNumber;
    var ifLike=this.data.ifLike;
    ifLike[item_index]=0;
    LikeOrgNumber=LikeOrgNumber-1;
    this.setData({ //本地删除
      ifLike: ifLike,
      LikeOrgNumber:LikeOrgNumber
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
        console.log("LikeOrganization调用UpdateUserList-delete云函数成功", res)
      },
      fail: res => {
        console.log("LikeOrganization调用UpdateUserList-delete云函数失败", res)
      }
    })
  }
})