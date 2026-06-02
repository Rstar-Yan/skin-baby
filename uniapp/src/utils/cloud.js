// 云开发工具函数
// 封装云函数调用

/**
 * 调用云函数
 * @param {string} name - 云函数名
 * @param {object} data - 参数
 * @returns {Promise<object>}
 */
export function callCloudFunction(name, data = {}) {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    wx.cloud.callFunction({
      name,
      data,
      success: res => resolve(res.result),
      fail: err => reject(err)
    })
    // #endif
    // #ifndef MP-WEIXIN
    resolve({ code: 0, data: {} })
    // #endif
  })
}

/**
 * 静默登录
 * @returns {Promise<object>} { id, openid, childName, ... }
 */
export async function login() {
  const result = await callCloudFunction('login', {})
  if (result.code === 0) {
    return result.data
  }
  return null
}

/**
 * 症状记录相关
 */
export const recordsApi = {
  /** 创建症状记录 */
  create(data) {
    return callCloudFunction('records', { action: 'create', ...data })
  },

  /** 查询记录列表 */
  list(page = 1, pageSize = 20) {
    return callCloudFunction('records', { action: 'list', page, pageSize })
  },

  /** 获取最新一条 */
  latest() {
    return callCloudFunction('records', { action: 'latest' })
  },

  /** 本周趋势 */
  weekTrend() {
    return callCloudFunction('records', { action: 'weekTrend' })
  },

  /** 最近照片 */
  recentPhotos() {
    return callCloudFunction('records', { action: 'recentPhotos' })
  },

  /** 按ID获取单条 */
  getById(id) {
    return callCloudFunction('records', { action: 'getById', id })
  }
}

/**
 * 润肤打卡相关
 */
export const moisturizeApi = {
  /** 打卡 */
  checkin(productName = '', areas = []) {
    return callCloudFunction('moisturize', { action: 'checkin', productName, areas })
  },

  /** 今日状态 */
  today() {
    return callCloudFunction('moisturize', { action: 'today' })
  },

  /** 月度摘要 */
  summary() {
    return callCloudFunction('moisturize', { action: 'summary' })
  }
}
