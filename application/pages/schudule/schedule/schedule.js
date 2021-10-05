// pages/schudule/schedule/schedule.js
var app = getApp()
var util = require('../../../utils/util.js'); //引入时间工具函数
Component({
  lifetimes: { //组件生命周期
    attached: function () {
      var ActivityInformation = app.globalData.activityInformation;
      var ifSchedule = this.judgeIfSchedule(ActivityInformation, app.globalData.openId);
      var ifSubscribe=this.judegeIfSubscribe(ActivityInformation,app.globalData.openId);
      var todayDate = util.formatTime(new Date()).split(' ')[0].split('-');
      todayDate.push(new Date().getDay());
      var month=['一','二','三','四','五','六','七','八','九','十','十一','十二'];
      todayDate[1]=month[parseInt(todayDate[1])-1];
      this.setData({
        information: ActivityInformation,
        ifSchedule: ifSchedule,
        ifSubscribe:ifSubscribe,
        todayDate: todayDate
      })
      this.judgeIfExpired() //判断活动是否过期
    },
    ready:function(){ //查看本组件的数据
      console.log("Schedule页面的数据",this.data) 
    } 
  },
  pageLifetimes: { //组件所在页面生命周期
    show: function () {
      var ifSchedule = this.judgeIfSchedule(this.data.information, app.globalData.openId)
      var ifSubscribe=this.judegeIfSubscribe(this.data.information, app.globalData.openId)
      this.setData({
        ifSchedule: ifSchedule,
        ifSubscribe:ifSubscribe
      })
      this.judgeIfExpired()//判断活动是否过期
      console.log(this.data)
    },
    hide: function () {//页面隐藏的时候清空，避免由于push()累加
      this.setData({
        ifExpired: [],
        ifSchedule: [],
        ifSubscribe:[]
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    information: null,
    ifExpired: [],
    ifSchedule: [],
    ifSubscribe: [],
    todayDate: null, //例：[2021,5,11,2]->[2021年，5月，11日，周二]
    weeks: ['星期日','星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
    judegeIfSubscribe(activityInformation, openID) { //查询全局变量activityInformation中本openID选择订阅的item，生成一个数据[0,1,0]
      let ifSubscribe = [];
      for (let i = 0; i < activityInformation.length; i++) {
        if (activityInformation[i].event.SubscribeUserList.indexOf(openID) > -1) {
          ifSubscribe.push(1);
        } else {
          ifSubscribe.push(0);
        }
      }
      return ifSubscribe
    },
    judgeIfExpired(e) { //判断活动是否过期，在拉取到information后调用
      let information = this.data.information
      for (let i = 0; i < information.length; i++) {
        let time = information[i].event.Date + ' ' + information[i].event.Time;
        let currTime = util.formatTime(new Date()).split(' ');
        let time_date = new Date(time)
        let currTime_date = new Date(currTime)
        if (currTime_date >= time_date) {
          this.setData({
            ifExpired: this.data.ifExpired.concat(true)
          })
        } else {
          this.setData({
            ifExpired: this.data.ifExpired.concat(false)
          })
        }
      }
    },
    //--------事件点击函数-----------
    clickSchedule(e) {
      // console.log(e.currentTarget.dataset.item)
      var docID = e.currentTarget.dataset.docid;
      var item_index = e.currentTarget.dataset.item_index
      // console.log(this.data.information[index].event.Activity)
      if (this.data.information[item_index].event.Lecture) {
        wx.navigateTo({
          url: '/pages/home/Lecture/LectureDetail/LectureDetail?item_index=' + item_index + "&docID=" + docID
        })
      } else if (this.data.information[item_index].event.Activity) {
        wx.navigateTo({
          url: '/pages/home/Campus/CampusDetail/CampusDetail?item_index=' + item_index + "&docID=" + docID
        })
      }
    },
    clickCancelSchedule(e) {
      // console.log(e)
      var DBdoc = e.currentTarget.dataset.docid
      var item_index = e.currentTarget.dataset.item_index
      //注意不能直接information: this.data.information.splice(index,1)，需要先临时变量处理好，setData只能赋值，不支持表达式
      let ifExpired = this.data.ifExpired
      let ifSchedule = this.data.ifSchedule
      ifSchedule[item_index] = 0;
      ifExpired[item_index] = 0;
      var userList = this.data.information[item_index].event.userList;
      for (let i = 0; i < userList.length; i++) {
        if (userList[i] == app.globalData.openId) {
          userList.splice(i, 1) //splice会直接修改根变量，也就是说把globalData中的变量内容也给删除了。因为js中数组属于引用赋值
        }
      }
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        duration: 2000,
        success: res => {
          this.setData({
            ifExpired: ifExpired,
            ifSchedule: ifSchedule
          })
        }
      })
      wx.cloud.callFunction({ //数据库删除
        name: 'UpdateUserList-delete',
        data: {
          DBcollections: 'activity_information',
          DBdoc: DBdoc,
          userOpenId: app.globalData.openId
          // userList:this.deleteUser(information.event.userList,app.globalData.openId)
        },
        success: res => {
          console.log("Schedule调用UpdateUserList-delete云函数成功", res)
        },
        fail: res => {
          console.log("Schedule调用UpdateUserList-delete云函数失败", res)
        }
      })
    },
    clickSubscribe(e) { //点击订阅消息
      var DBdoc = e.currentTarget.dataset.docid
      var item_index = e.currentTarget.dataset.item_index
      var SubscribeInformation = this.data.information[item_index]
      const temlIds = '1-fnn5MAOESF36LjlBSFWOggWQQjGjulB4Zye5SPQOA'
      var that = this;
      wx.requestSubscribeMessage({ //订阅消息
        tmplIds: [temlIds],
        success(res) {
          // console.log(res['1-fnn5MAOESF36LjlBSFWOggWQQjGjulB4Zye5SPQOA'] )
          if (res['1-fnn5MAOESF36LjlBSFWOggWQQjGjulB4Zye5SPQOA'] == 'accept') {
            wx.cloud.callFunction({ //把订阅的消息内容添加进数据库
              name: 'Subscribe',
              data: {
                DBcollections: 'subscribe_message',
                page: "pages/welcome/welcome",
                data: SubscribeInformation,
                templateId: temlIds
              },
              success: res => {
                wx.showToast({ //success回调函数中的代码执行顺序是从下往上
                  title: '订阅成功',
                  icon: 'success',
                  duration: 2000,
                  success: res => {

                    //直接修改全局变量进行本地更新
                    var ifSubscribe=that.data.ifSubscribe;
                    ifSubscribe[item_index] = 1;
                    var SubscribeUserList = app.globalData.activityInformation[item_index].event.SubscribeUserList;
                    SubscribeUserList.push(app.globalData.openId);
                    app.globalData.activityInformation[item_index].event.SubscribeUserList = SubscribeUserList;
                    that.setData({
                      ifSubscribe: ifSubscribe
                    })
                    wx.cloud.callFunction({ //云端更新
                      name: 'UpdateSubscribeUserList-add',
                      data: {
                        DBcollections: 'activity_information',
                        DBdoc: DBdoc,
                        userOpenId: app.globalData.openId
                      },
                      success: res => {
                        console.log("Schedule调用UpdateSubscribeUserList-add云函数成功", res)
                      },
                      fail: res => {
                        console.log("Schedule调用UpdateSubscribeUserList-add云函数失败", res)
                      }
                    })

                  }
                })
                console.log('Schedule调用Subscribe上传订阅消息成功', res)
              },
              fail: res => {
                console.log('Schedule调用Subscribe上传订阅消息失败', res)
              }
            })
          }
        }
      })
    }
  }
})