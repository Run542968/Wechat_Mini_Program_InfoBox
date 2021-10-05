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

  return DB.collection(event.DBcollections).doc(event.DBdoc).remove({ //await回阻塞一个异步调用
    success: (res) => {
      console.log('云函数调用删除成功', res)
    },
    fail: (res) => {
      console.log('云函数调用删除失败', res)
    }
  })
}