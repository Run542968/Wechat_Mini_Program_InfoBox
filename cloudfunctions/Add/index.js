//添加校园活动、讲座、志愿、组织、用户列表等信息调用的云函数

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

  return DB.collection(event.DBcollections).add({ //await回阻塞一个异步调用
    data: {
      event: event
    },
    success: (res) => {
      console.log('云函数调用增加成功', res)
    },
    fail: (res) => {
      console.log('云函数调用增加失败', res)
    }
  })
}