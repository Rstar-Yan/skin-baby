/**
 * 肤小宝 微信小程序上传脚本
 * 
 * 用法: node deploy/upload.js --version 1.0.0 --desc "MVP初版"
 * 
 * 环境变量:
 *   WX_UPLOAD_KEY_PATH  - 上传私钥文件路径（必填）
 *   WX_APPID            - 微信小程序 AppID（可选，默认读取 project.config.json）
 *   WX_ROBOT            - 上传机器人编号（可选，默认 1）
 */

const ci = require('miniprogram-ci')
const path = require('path')
const config = require('./ci.config')

// 解析命令行参数
function parseArgs() {
  const args = {}
  process.argv.slice(2).forEach((arg, i, arr) => {
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const val = arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true
      args[key] = val
    }
  })
  return args
}

async function main() {
  const args = parseArgs()
  const version = args.version || config.upload.defaultVersion
  const desc = args.desc || args.description || config.upload.defaultDescription

  // 检查私钥（支持环境变量 WX_UPLOAD_KEY 或 WX_UPLOAD_KEY_PATH）
  const privateKeyContent = process.env.WX_UPLOAD_KEY
  let privateKeyPath = config.privateKeyPath
  
  const fs = require('fs')
  if (privateKeyContent) {
    // 从环境变量读取私钥内容，写入临时文件
    privateKeyPath = '/tmp/wx-upload-key.pem'
    fs.writeFileSync(privateKeyPath, privateKeyContent, 'utf8')
    console.log('从环境变量读取私钥，写入临时文件')
  } else if (!privateKeyPath) {
    console.error('错误: 请设置 WX_UPLOAD_KEY 或 WX_UPLOAD_KEY_PATH 环境变量')
    console.error('WX_UPLOAD_KEY: 私钥文件内容（base64或文本）')
    console.error('WX_UPLOAD_KEY_PATH: 私钥文件路径')
    process.exit(1)
  }

  if (!fs.existsSync(privateKeyPath)) {
    console.error(`错误: 私钥文件不存在: ${privateKeyPath}`)
    process.exit(1)
  }

  // 检查编译产物
  if (!fs.existsSync(config.distPath)) {
    console.error(`错误: 编译产物目录不存在: ${config.distPath}`)
    console.error('请先执行: npm run build:mp-weixin')
    process.exit(1)
  }

  console.log('=== 肤小宝 微信小程序上传 ===')
  console.log(`AppID: ${config.appid}`)
  console.log(`版本: ${version}`)
  console.log(`描述: ${desc}`)
  console.log(`机器人: ${config.upload.robot}`)
  console.log(`产物路径: ${config.distPath}`)

  // 创建 Project 实例
  const project = new ci.Project({
    appid: config.appid,
    type: 'miniProgram',
    projectPath: config.distPath,
    privateKeyPath: privateKeyPath,
    ignores: ['node_modules/**/*']
  })

  try {
    // 上传体验版
    const uploadResult = await ci.upload({
      project,
      version: version,
      desc: desc,
      robot: config.upload.robot,
      setting: {
        es6: true,
        es7: true,
        minify: true,
        codeProtect: false,
        autoPrefixWXSS: true
      },
      onProgressUpdate: (progress) => {
        if (progress && progress.status) {
          console.log(`上传进度: ${progress.status}`)
        }
      }
    })

    console.log('=== 上传成功 ===')
    console.log(uploadResult)
  } catch (err) {
    console.error('上传失败:', err.message)
    process.exit(1)
  }
}

main()