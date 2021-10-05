//消息订阅
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: "cloud1-7g8yg4yd91a7164a"
})

const DB = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID} = cloud.getWXContext();

  return await DB.collection(event.DBcollections).add({
    data:{
        touser:OPENID,
        page:event.page,
        data: event.data, // 订阅消息的数据
        templateId: event.templateId, // 订阅消息模板ID
        done: false, // 消息发送状态设置为 false
    },
    success:res=>{
      console.log('Subscrbe调用成功')
    },
    fail:res=>{
      console.log('Subscrbe调用失败')
    }
  })
}