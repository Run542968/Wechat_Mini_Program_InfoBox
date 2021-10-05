//更新每个record中的用户openId列表——用于收藏功能判断该用户选择收藏
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: "cloud1-7g8yg4yd91a7164a"
})
const DB = cloud.database()
const _= DB.command  

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await DB.collection(event.DBcollections).doc(event.DBdoc).update({
    data: {
      'event.SubscribeUserList': _.push(event.userOpenId)
    },
    success:res=>{
      console.log('SubscribeUserList-add数据更新成功',res)
    }
  })
}