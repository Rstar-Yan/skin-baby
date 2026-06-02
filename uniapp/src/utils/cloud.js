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
    // H5 或模拟器环境 - 返回 mock
    resolve({ code: 0, data: {} })
    // #endif
  })
}

/**
 * 微信登录
 * @returns {Promise<object>} { openid, isNew }
 */
export async function login() {
  // #ifdef MP-WEIXIN
  const { code } = await wx.login()
  const result = await callCloudFunction('login', { code })
  return result.data
  // #endif
  return { openid: 'mock_openid', isNew: false }
}
