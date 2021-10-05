// application/pages/mine/Usertutorial/Usertutorial.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageLecture:"使用说明",
    imgList:["cloud://cloud1-7g8yg4yd91a7164a.636c-cloud1-7g8yg4yd91a7164a-1306047938/User_Introduct/主页面.png","cloud://cloud1-7g8yg4yd91a7164a.636c-cloud1-7g8yg4yd91a7164a-1306047938/User_Introduct/讲座.png","cloud://cloud1-7g8yg4yd91a7164a.636c-cloud1-7g8yg4yd91a7164a-1306047938/User_Introduct/校园活动.png","cloud://cloud1-7g8yg4yd91a7164a.636c-cloud1-7g8yg4yd91a7164a-1306047938/User_Introduct/志愿活动.png","cloud://cloud1-7g8yg4yd91a7164a.636c-cloud1-7g8yg4yd91a7164a-1306047938/User_Introduct/组织2.png","cloud://cloud1-7g8yg4yd91a7164a.636c-cloud1-7g8yg4yd91a7164a-1306047938/User_Introduct/管理端.png"]
  },
  preview(e){
    console.log(e.currentTarget.dataset.src)
    let currentUrl = e.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.imgList // 需要预览的图片http链接列表
    })
  }
})