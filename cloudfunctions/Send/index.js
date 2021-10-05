//订阅消息定时发送
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: "cloud1-7g8yg4yd91a7164a"
})
const DB = cloud.database()

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var currDate = formatTime(new Date());

  try {
    // 从云开发数据库中查询等待发送的消息列表
    const messages = await DB.collection('subscribe_message').where({
      'data.event.Date': currDate
    }).get();

    
    // 循环消息列表
    const sendPromises = messages.data.map(async message => {
      try {
        // 发送订阅消息
        const result=await cloud.openapi.subscribeMessage.send({
          touser: message.touser,
          page: message.page,
          data: {
            'thing1': {
              "value": message.data.event.Title
            },
            'time3': {
              "value": message.data.event.Date + ' '+ message.data.event.Time
            },
            'thing4': {
              "value": message.data.event.Location
            },
            'thing5': {
              "value": message.data.event.picker[message.data.event.index]
            }
          },
          templateId: '1-fnn5MAOESF36LjlBSFWOggWQQjGjulB4Zye5SPQOA',
          miniprogram_state:'trial'
        })
        console.log(result)
        // 发送成功后将该条记录删除
        return DB.collection('subscribe_message')
          .doc(message._id)
          .remove();
      } catch (err) {
        console.log(err)
        return err;
      }
    });
    console.log("message",messages)
    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return err;
  }
}