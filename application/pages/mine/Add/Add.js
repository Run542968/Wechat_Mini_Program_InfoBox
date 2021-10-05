// application/pages/mine/Update/Update.js
var util = require('../../../utils/util.js'); //引入时间工具函数
var app = getApp(); //引入全局变量
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Title: '',//大标题
    SubTitle:'',//小标题
    Time: '',//活动时间
    Date: '',//活动日期
    Location: '',//活动地点
    Holder:'',//主办单位
    InforCome: '',//信息来源
    index: null,//picker的索引
    Lecture: false,
    LectureInf: '讲座票', //默认值
    Volunteer: false,
    VolunteerInf: '志愿时',
    VolunteerNumber:'',
    VolunteerContact:'',
    VolunteerContactWay:'',
    Activity: false,
    ActivityInf: '校园活动',
    picker: ['校内讲座', '志愿活动', '校园活动'],
    tempImgList: [],
    imgList: [],//最终上传的图片列表
    textareaValue: '',//活动文本信息
    userList:[],//用于后续用户日程添加用户openID
    pageAdd:'添加活动'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = util.formatTime(new Date()).split(' ');
    this.setData({
      Date: time[0],
      Time: time[1]
    })
  },
  // --------------事件点击函数-----------
  inputTitle(e) {
    this.setData({
      Title: e.detail.value
    })
  },
  inputSubTitle(e){
    this.setData({
      SubTitle: e.detail.value
    })
  },
  DateChange(e) {
    this.setData({
      Date: e.detail.value
    })
  },
  TimeChange(e) {
    this.setData({
      Time: e.detail.value
    })
  },
  inputLocation(e) {
    this.setData({
      Location: e.detail.value
    })
  },
  inputHolder(e){
    this.setData({
      Holder: e.detail.value
    })
  },
  inputInforCome(e) {
    this.setData({
      InforCome: e.detail.value
    })
  },
  PickerChange(e) {
    var index = e.detail.value;
    if (index == 0) {
      this.setData({
        Lecture: true,
        Volunteer: false,
        Activity: false,
        index: index
      })
    } else if (index == 1) {
      this.setData({
        Lecture: false,
        Volunteer: true,
        Activity: false,
        index: index
      })
    } else {
      this.setData({
        Lecture: false,
        Volunteer: false,
        Activity: true,
        index: index
      })
    }
  },
  inputLectureInf(e) {
    this.setData({
      LectureInf: e.detail.value
    })
  },
  inputVolunteerInf(e) {
    this.setData({
      VolunteerInf: e.detail.value
    })
  },
  inputVolunteerNumber(e){
    this.setData({
      VolunteerNumber: e.detail.value
    })
  },
  inputVolunteerContact(e){
    this.setData({
      VolunteerContact: e.detail.value
    })
  },
  inputVolunteerContactWay(e){
    this.setData({
      VolunteerContactWay: e.detail.value
    })
  },
  inputActivityInf(e) {
    this.setData({
      ActivityInf: e.detail.value
    })
  },
  ChooseImage() {
    var that = this;
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      //Promise语法解决异步上传问题
      success: function (res) {
        let s = res.tempFilePaths.length
        wx.showLoading({
          title: '上传中...',
        })
        Promise.all(res.tempFilePaths.map((item) => {
            return wx.cloud.uploadFile({
              cloudPath: 'activity_information/' + Date.now() +'_'+app.selfAdd()+ item.match(/\.[^.]+?$/)[0], // 文件名称 
              filePath: item,
            })
          }))
          .then((resCloud) => {
            wx.hideLoading()//消失就说明云存储上传成功了
            console.log("文案插图上传云存储成功",resCloud)
            // that 是page this imgList是提交数据，tempImgList是回显的路径
            // 要是自己服务器的话不用，云开发 图片加载的太慢了 用temp临时文件 回显
            that.setData({
              imgList: that.data.imgList.concat(resCloud.map((item) => {
                return item.fileID
              })),
              tempImgList: that.data.tempImgList.concat(res.tempFilePaths.map((item) => {
                return item
              }))
            })
          }).catch((err) => {
            console.log(err)
          })
      },
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.tempImgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '靓仔',
      content: '确定要删除这张图片吗？',
      cancelText: '再想想',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.tempImgList.splice(e.currentTarget.dataset.index, 1);
          wx.cloud.deleteFile({
            fileList: [this.data.imgList[e.currentTarget.dataset.index]]
          }).then(res => {
            // handle success
            console.log("图片从云存储删除",res)
          }).catch(error => {
            // handle error
          })
          this.data.imgList.splice(e.currentTarget.dataset.index, 1)
          this.setData({
            tempImgList: this.data.tempImgList
          })
        }
      }
    })
  },
  inputTextarea(e) {
    this.setData({
      textareaValue: e.detail.value
    })
  },
  clickUpload(e) {
    // 判断是否为空
    if (this.data.Title == '') { //暂时先做一下标题的非空判断
      wx.showToast({
        title: '标题不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.Location == '') {
      wx.showToast({
        title: '活动地点不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.InforCome == '') {
      wx.showToast({
        title: '信息来源不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.index == null) {
      wx.showToast({
        title: '请选择活动类型',
        icon: 'none',
        duration: 2000
      })
    } else {
      let that = this
      //调用云函数上传数据库
      wx.cloud.callFunction({
        name: "Add",
        data: {
          DBcollections: 'activity_information',
          Title: that.data.Title,
          SubTitle:that.data.SubTitle,
          Time: that.data.Time,
          Date: that.data.Date,
          Location: that.data.Location,
          Holder:that.data.Holder,
          InforCome: that.data.InforCome,
          Lecture: that.data.Lecture,
          LectureInf: that.data.LectureInf,
          Volunteer: that.data.Volunteer,
          VolunteerInf: that.data.VolunteerInf,
          VolunteerNumber:that.data.VolunteerNumber,
          VolunteerContact:that.data.VolunteerContact,
          VolunteerContactWay:that.data.VolunteerContactWay,
          Activity: that.data.Activity,
          ActivityInf: that.data.ActivityInf,
          picker: that.data.picker,
          index: that.data.index,
          imgList: that.data.imgList,
          textareaValue: that.data.textareaValue,
          userList:[],//用于关注用户的userList
          SubscribeUserList:[]//用于保存已经点击订阅该消息的用户openId
        },
        success: res => {
          console.log('云函数Add调用成功', res)
          wx.navigateBack({
              delta: 1,
            }),
            wx.showToast({ //success回调函数中的代码执行顺序是从下往上
              title: '上传成功',
              icon: 'success',
              duration: 2000
            })
        },
        fail: res => {
          console.log('云函数Add调用失败', res)
          wx.navigateBack({
              delta: 1,
            }),
            wx.showToast({
              title: '上传失败',
              icon: 'error',
              duration: 2000
            })
        }
      })
    }
  }
})