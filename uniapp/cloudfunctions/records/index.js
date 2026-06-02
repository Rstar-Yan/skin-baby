// 云函数：症状记录 CRUD
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const $ = db.command.aggregate

exports.main = async (event, context) => {
  const { wxContext } = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { action, data, recordId, page = 1, pageSize = 20 } = event

  switch (action) {
    case 'create': {
      const record = {
        openid,
        ...data,
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
      const res = await db.collection('records').add({ data: record })
      return { code: 0, data: { id: res._id } }
    }

    case 'list': {
      const res = await db.collection('records')
        .where({ openid })
        .orderBy('createdAt', 'desc')
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .get()
      const total = await db.collection('records').where({ openid }).count()
      return { code: 0, data: { list: res.data, total: total.total } }
    }

    case 'get': {
      const res = await db.collection('records').doc(recordId).get()
      return { code: 0, data: res.data }
    }

    case 'update': {
      await db.collection('records').doc(recordId).update({
        data: { ...data, updatedAt: db.serverDate() }
      })
      return { code: 0 }
    }

    case 'delete': {
      await db.collection('records').doc(recordId).remove()
      return { code: 0 }
    }

    default:
      return { code: -1, message: '未知操作' }
  }
}
