import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni.default()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '',
        importer: (url) => {
          if (url.startsWith('~@dcloudio/uni-ui')) {
            return { file: url.replace('~', '') }
          }
          return null
        }
      }
    }
  }
})