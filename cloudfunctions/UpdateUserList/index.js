//更新每个record中的用户openId列表——用于收藏功能判断该用户选择收藏————目前废弃了，用UpdateUserLIst-add/delete代替
//2021.4.21

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: "cloud1-7g8yg4yd91a7164a"
})
const DB = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await DB.collection(event.DBcollections).doc(event.DBdoc).update({
    data: {
      'event.userList': event.DBcommand
    },
    success:res=>{
      console.log('数据更新成功',res)
    }
  })
}