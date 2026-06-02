<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user.js'

onLaunch(() => {
  console.log('肤小宝 App Launch')
  // 静默登录：获取 openid + 同步用户记录
  const userStore = useUserStore()
  userStore.doLogin()
})

onShow(() => {
  console.log('肤小宝 App Show')
})

onHide(() => {
  console.log('肤小宝 App Hide')
})
</script>

<style lang="scss">
/* 全局样式 */
page {
  --color-primary: #4A90D9;
  --color-primary-soft: #EBF2FA;
  --color-green: #52B788;
  --color-green-soft: #EDF7F1;
  --color-amber: #D4A843;
  --color-amber-soft: #FBF5E8;
  --color-red: #D9534F;
  --color-red-soft: #FCEEED;
  --color-text: #383E48;
  --color-text-secondary: #7A828E;
  --color-text-muted: #9AA0A6;
  --color-surface: #F8F9FB;
  --color-card: #FFFFFF;
  --color-border: #E8ECF0;
}
</style>
