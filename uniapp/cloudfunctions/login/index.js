// 云函数：微信登录
// 接收 wx.login() 的 code，返回 openid + custom token
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

exports.main = async (event, context) => {
  const { wxContext } = cloud.getWXContext()
  const openid = wxContext.OPENID
  const unionid = wxContext.UNIONID || ''

  // 查找或创建用户
  let user = await db.collection('users').where({ openid }).get()
  
  if (user.data.length === 0) {
    // 新用户，自动创建
    const result = await db.collection('users').add({
      data: {
        openid,
        unionid,
        nickname: '',
        avatar: '',
        children: [],
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })
    return {
      code: 0,
      data: { isNew: true, openid }
    }
  }

  return {
    code: 0,
    data: { isNew: false, openid, user: user.data[0] }
  }
}
