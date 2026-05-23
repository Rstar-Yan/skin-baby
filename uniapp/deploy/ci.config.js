/**
 * 肤小宝 CI 配置
 * 
 * 从环境变量读取私钥，安全考虑不硬编码敏感信息。
 * 
 * 环境变量:
 *   WX_UPLOAD_KEY_PATH  - 微信小程序上传私钥文件路径
 *   WX_APPID            - 微信小程序 AppID（覆盖 project.config.json 中的值）
 */

const path = require('path')

module.exports = {
  // 项目根目录（uniapp/）
  projectPath: path.resolve(__dirname, '..'),

  // 编译输出目录
  distPath: path.resolve(__dirname, '../dist/build/mp-weixin'),

  // 微信小程序 AppID（优先从环境变量读取，否则从 project.config.json 读取）
  appid: process.env.WX_APPID || (() => {
    try {
      const config = require(path.resolve(__dirname, '../dist/build/mp-weixin/project.config.json'))
      return config.appid
    } catch (e) {
      // 回退：尝试读取源码目录中的配置
      try {
        const srcConfig = require(path.resolve(__dirname, '../src/project.config.json'))
        return srcConfig.appid
      } catch (e2) {
        return 'touristappid'
      }
    }
  })(),

  // 上传私钥路径（从环境变量读取，优先 WX_UPLOAD_KEY_PATH，否则用默认路径）
  privateKeyPath: process.env.WX_UPLOAD_KEY_PATH || '',

  // 上传配置
  upload: {
    // 默认版本号（可被命令行参数覆盖）
    defaultVersion: '1.0.0',
    // 默认版本描述
    defaultDescription: '肤小宝上传',
    // 机器人编号（1-30）
    robot: process.env.WX_ROBOT ? parseInt(process.env.WX_ROBOT) : 1
  },

  // GitHub Actions 环境检测
  isCI: !!process.env.CI || !!process.env.GITHUB_ACTIONS
}