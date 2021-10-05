var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    organizations:null,//活动信息
    activities:null,//组织信息
    PageDelete:'删除活动'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var activities=app.globalData.activityInformation;
    var organizations=app.globalData.organizationInformation;
    this.setData({
      activities:activities,
      organizations:organizations
    })
  },
  //----------事件点击函数-------------
  clickDeleteActivity(e){
    var item_index=e.currentTarget.dataset.item_index;
    var docID=e.currentTarget.dataset.docid;
    var activities=this.data.activities;
    activities.splice(item_index,1);//本地删除，可以直接删除全局量
    this.setData({
      activities:activities//此时的activities引用所指向的app.globalData.activityInformation中已经发生了删除操作
    })

    wx.cloud.callFunction({//云端删除
      name: "Delete",
      data: {
        DBcollections: 'activity_information',
        DBdoc:docID
      },
      success:res=>{
        console.log("Delete调用Delete云函数删除activity成功",res)
      },
      fail:res=>{
        console.log("Delete调用Delete云函数删除activity失败",res)
      }
    })
  },
  clickDeleteOrganization(e){
    var item_index=e.currentTarget.dataset.item_index;
    var docID=e.currentTarget.dataset.docid;
    var organization=this.data.organizations;
    organization.splice(item_index,1);//本地删除，可以直接删除全局量
    this.setData({
      organization:organization//此时的organization引用所指向的app.globalData.organizationInformation中已经发生了删除操作
    })

    wx.cloud.callFunction({//云端删除
      name: "Delete",
      data: {
        DBcollections: 'organzation_information',
        DBdoc:docID
      },
      success:res=>{
        console.log("Delete调用Delete云函数删除organization成功",res)
      },
      fail:res=>{
        console.log("Delete调用Delete云函数删除organization失败",res)
      }
    })
  }
})