import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// 云开发初始化（仅在微信小程序环境）
// #ifdef MP-WEIXIN
wx.cloud.init({
  env: 'skin-baby-xxxxx', // 稍后创建云环境后替换
  traceUser: true
})
// #endif

export function createApp() {
  const app = createSSRApp(App)
  app.use(createPinia())
  return { app }
}