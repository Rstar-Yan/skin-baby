import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// 云开发初始化（仅在微信小程序环境）
// #ifdef MP-WEIXIN
wx.cloud.init({
  env: 'cloudbase-d3gkqze7q3faa631e', // 云环境ID
  traceUser: true
})
// #endif

export function createApp() {
  const app = createSSRApp(App)
  app.use(createPinia())
  return { app }
}