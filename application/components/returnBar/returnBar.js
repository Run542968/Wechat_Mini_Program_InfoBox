//获取应用实例 
const app = getApp()

Component({
  /** 
   * 组件的属性列表 
   */
  properties: {
    pageTitle: {
      type: String
    },
  },

  /** 
   * 组件的初始数据 
   */
  data: {
    s: app.system.statusBarHeight, //状态栏高度 
    n: (app.menu.top - app.system.statusBarHeight) * 2 + app.menu.height, //导航栏高度 
    h: app.menu.height, //胶囊高度
  },

  methods:{
    toBack:function(){
      wx.navigateBack({
       delta: 1
      })
    }
  }
})