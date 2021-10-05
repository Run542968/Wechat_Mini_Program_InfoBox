// application/pages/mine/AddOrganization/AddOrganization.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Title: '',//组织名
    Belongs: '',//Organization Belongs
    PublicTitle:'',
    OrgIntrodution:'',//Organization Introduction
    picker:['校级','院级'],
    index:null,//Organization Type （School:0; Academy:1）
    tempImgList:[],
    imgList: [],
    inputOrgActivityIntro1: '',//Organization's Activity Introduction 1
    inputOrgActivityIntro2: '',
    pageAddOrg:'添加组织'
  },
  //-------------事件点击函数------------
  inputTitle(e) {
    this.setData({
      Title: e.detail.value
    })
  },
  inputBelongs(e) {
    this.setData({
      Belongs: e.detail.value
    })
  },
  inputPublicTitle(e){
    this.setData({
      PublicTitle: e.detail.value
    })
  },
  inputOrgIntrodution(e){
    this.setData({
      OrgIntrodution: e.detail.value
    })
  },
  PickerChange(e){
    var index = e.detail.value;
    this.setData({
      index:index
    })
  },
  ChooseImage() {
    var that = this;
    wx.chooseImage({
      count: 6, //默认9
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
              cloudPath: 'organzation_information/' + Date.now() +'_'+app.selfAdd()+ item.match(/\.[^.]+?$/)[0], // 文件名称 
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
      urls: this.data.imgList,
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
  inputOrgActivityIntro1(e) {
    this.setData({
      inputOrgActivityIntro1: e.detail.value
    })
  },
  inputOrgActivityIntro2(e) {
    this.setData({
      inputOrgActivityIntro2: e.detail.value
    })
  },
  clickUpload(e) {
    // 判断是否为空
    if (this.data.Title == '') { //暂时先做一下标题的非空判断
      wx.showToast({
        title: '组织名不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.Belongs == '') {
      wx.showToast({
        title: '组织归属不能为空',
        icon: 'none',
        duration: 2000
      })
    }else if(this.data.index==null){
      wx.showToast({
        title: '组织级别不能为空',
        icon: 'none',
        duration: 2000
      })
    }else if(this.data.OrgIntrodution==''){
      wx.showToast({
        title: '组织简介不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      let that = this
      wx.cloud.callFunction({
        name: "Add",
        data: {
          DBcollections: 'organzation_information',
          Title: that.data.Title,
          Belongs: that.data.Belongs,
          PublicTitle:that.data.PublicTitle,
          OrgIntrodution:that.data.OrgIntrodution,
          index:that.data.index,
          imgList: that.data.imgList,
          inputOrgActivityIntro1: that.data.inputOrgActivityIntro1,
          inputOrgActivityIntro2: that.data.inputOrgActivityIntro2,
          userList:[]//用于后续添加关注用户的openID
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