//app.js
var util = require('./utils/util.js'); //引入时间工具函数
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
        env: "cloud1-7g8yg4yd91a7164a"
      })
    }

    this.globalData = {
      //记录云存储存储图片的识别编号,每次重编译小程序，初始值为0（解决了时间戳不稳定的问题）
      imgNumber: 0,
      openId: null, //全局openId，值为当前用户的openId
      activityInformation: null,
      organizationInformation: null,
      authorUserList: null
    }

    try {
      var leastStoreTimestamp = wx.getStorageSync('leastStoreTimestamp');
      let currDay=util.formatTime(new Date()).split(' ')[0];
      if (leastStoreTimestamp!=currDay) {
        console.log("最近一次拉取数据日期与今日非同一天，重新拉取云端数据并保存在本地");
        this.getOpenId() //获取用户openId
        this.getActivityInformation() //获取activity_information表中的信息
        this.getOrganizationInformation() ///获取organization_information表中的信息
        this.getAutherUserList() ///获取authorUserList表中的信息
        this.getLeastStoreTimestamp()//获取最近一个从云端拉取数据的日期，最小单位是day
      }
      else{
        console.log("最近一次拉取数据日期与今日同一天,直接加载本地数据");
        wx.getStorage({
          key: 'openId',
          success: res => {
            console.log("获取本地缓存openId成功", res.data)
            this.globalData.openId = res.data
          },
          fail: res => {
            console.log("获取本地缓存openId失败", res.data)
          }
        })
        wx.getStorage({
          key: 'activityInformation',
          success: res => {
            console.log("获取本地缓存activityInformation成功", res.data)
            this.globalData.activityInformation = res.data
          },
          fail: res => {
            console.log("获取本地缓存activityInformation失败", res.data)
          }
        })
        wx.getStorage({
          key: 'organizationInformation',
          success: res => {
            console.log("获取本地缓存organizationInformation成功", res.data)
            this.globalData.organizationInformation = res.data
          },
          fail: res => {
            console.log("获取本地缓存organizationInformation失败", res.data)
          }
        })
        wx.getStorage({
          key: 'authorUserList',
          success: res => {
            console.log("获取本地缓存authorUserList成功", res.data)
            this.globalData.authorUserList = res.data
          },
          fail: res => {
            console.log("获取本地缓存authorUserList失败", res.data)
          }
        })
      }
    } catch (e) {
      console.log("获取本地leastStoreTimestamp出错",e)
    }
    
    wx.getSystemInfo({
      success: res => {
        this.system = res
      }
    })
    //获取胶囊信息 
    this.menu = wx.getMenuButtonBoundingClientRect()

  },
  onHide: function () {//当小程序退出时，把本地更新的信息保存进缓存
    wx.setStorage({
      key: "openId",
      data: this.globalData.openId,
      success: res => {
        console.log("小程序onHide时openId缓存本地成功", res)
      },
      fail: res => {
        console.log("小程序onHide时openId缓存本地失败", res)
      }
    }),
    wx.setStorage({ //存入缓存
      key: "activityInformation",
      data: this.globalData.activityInformation,
      success: res => {
        console.log("小程序onHide时activityInformation缓存本地成功", res)
      },
      fail: res => {
        console.log("小程序onHide时activityInformation缓存本地失败", res)
      }
    }),
    wx.setStorage({
      key: "organizationInformation",
      data: this.globalData.organizationInformation,
      success: res => {
        console.log("小程序onHide时organizationInformation缓存本地成功", res)
      },
      fail: res => {
        console.log("小程序onHide时organizationInformation缓存本地失败", res)
      }
    })
  },


  //-----------自增函数---------
  selfAdd() {
    this.globalData.imgNumber += 1;
    return this.globalData.imgNumber
  },
  getOpenId(e) { //小程序一启动，就获取用户openId
    wx.cloud.callFunction({
      name: "GetOpenId",
      success: res => {
        console.log("app.js调用GetOpenId成功", res)
        this.globalData.openId = res.result.event.userInfo.openId

        wx.setStorage({
          key: "openId",
          data: res.result.event.userInfo.openId,
          success: res => {
            console.log("本地openId缓存成功", res)
          },
          fail: res => {
            console.log("本地openId缓存失败", res)
          }
        })
      },
      fail: res => {
        console.log("app.js调用GetOpenId失败", res)
      }
    })
  },

  //修改版本,可以获取集合中所有的记录，不受20条的限制，且异步执行！！！！——值得学习
  getActivityInformation(e) { //获取activity_information表中的信息
    var activityInformation = [];
    var MAX_LIMIT = 2;
    wx.cloud.database().collection('activity_information').count().then(async res => {
      let total = res.total;
      // 计算需分几次取
      const batchTimes = Math.ceil(total / MAX_LIMIT)
      // 承载所有读操作的 promise 的数组
      for (let i = 0; i < batchTimes; i++) {
        await wx.cloud.database().collection('activity_information').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(async res => {
          let new_data = res.data
          activityInformation = activityInformation.concat(new_data)
        })
      }
      console.log("成功获取activity_information集合中所有数据", activityInformation.length)

      //对获取到的所有数据按照举办时间进行排序
      activityInformation.sort(function (a, b) {
        let time_a = new Date(a.event.Date + ' ' + a.event.Time);
        let time_b = new Date(b.event.Date + ' ' + b.event.Time);
        if (time_a < time_b) {
          return -1;
        }
        if (time_a > time_b) {
          return 1;
        }
        return 0;
      })

      let currTime = new Date(util.formatTime(new Date()).split(' '));
      var expire_index=0;//第一个没过期的活动的下标
      for(let i=0;i<activityInformation.length;i++){//把过期的活动放在后面，for循环用于寻找按时间排序后过期活动的下标
          let item_date=new Date(activityInformation[i].event.Date + ' '+activityInformation[i].event.Time);
          if(item_date<currTime){
            expire_index=expire_index+1;
          }
      }
      var expire_activity=activityInformation.slice(0,expire_index);
      activityInformation.splice(0,expire_index)
      activityInformation=activityInformation.concat(expire_activity)

      //把排序后的数据存入全局变量（调试过程中先存入缓存，最终版本不存入缓存）
      this.globalData.activityInformation = activityInformation; //存入全局变量
      wx.setStorage({ //存入缓存
        key: "activityInformation",
        data: activityInformation,
        success: res => {
          console.log("本地activityInformation缓存成功", res)
        },
        fail: res => {
          console.log("本地activityInformation缓存失败", res)
        }
      })
    })
  },

  //异步promise风格加载全部
  getOrganizationInformation(e) { ///获取organization_information表中的信息
    var organizationInformation = [];
    var MAX_LIMIT = 2;
    wx.cloud.database().collection('organzation_information').count().then(async res => {
      let total = res.total;
      //计算分几次取
      const batchTimes = Math.ceil(total / MAX_LIMIT);
      for (let i = 0; i < batchTimes; i++) {
        await wx.cloud.database().collection('organzation_information').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get().then(async res => {
          let new_data = res.data;
          organizationInformation = organizationInformation.concat(new_data);
        })
      }
      console.log("成功获取全部organizationInformation数据", organizationInformation.length);
      this.globalData.organizationInformation = organizationInformation; //存入全局变量
      wx.setStorage({
        key: "organizationInformation",
        data: organizationInformation,
        success: res => {
          console.log("本地organizationInformation缓存成功", res)
        },
        fail: res => {
          console.log("本地organizationInformation缓存失败", res)
        }
      })
    })
  },
  getAutherUserList(e) { ///获取authorUserList表中的信息
    wx.cloud.database().collection('authorUserList').get({
      success: res => {
        console.log("App.js拉取authorUserList信息成功", res)
        this.globalData.authorUserList = res.data[0].authorUserList

        wx.setStorage({
          key: "authorUserList",
          data: res.data[0].authorUserList,
          success: res => {
            console.log("本地authorUserList缓存成功", res)
          },
          fail: res => {
            console.log("本地authorUserList缓存失败", res)
          }
        })
      },
      fail: res => {
        console.log("App.js拉取authorUserList信息失败", res)
      }
    })
  },
  getLeastStoreTimestamp(e){
    let currDay = util.formatTime(new Date()).split(' ')[0];
    wx.setStorage({
      key: "leastStoreTimestamp",
      data: currDay,
      success: res => {
        console.log("本地leastStoreTimestamp缓存成功", res)
      },
      fail: res => {
        console.log("本地leastStoreTimestamp缓存失败", res)
      }
    })
  }
})