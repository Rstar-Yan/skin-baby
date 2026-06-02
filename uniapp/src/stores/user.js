import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login } from '@/utils/cloud.js'

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref(null)
  const loading = ref(false)
  const initialized = ref(false)
  const error = ref('')

  // 计算属性
  const isLoggedIn = computed(() => !!user.value)
  const childDisplayName = computed(() => {
    return user.value?.childName || '宝宝'
  })

  /**
   * 静默登录：调 login 云函数，获取 openid + 用户信息
   * 小程序启动时自动调用
   */
  const doLogin = async () => {
    if (initialized.value) return

    loading.value = true
    error.value = ''

    try {
      const data = await login()
      user.value = data
      initialized.value = true
      return data
    } catch (err) {
      console.error('登录失败:', err)
      error.value = '登录失败，请重试'
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新用户字段（nickname, childName 等）
   */
  const updateUser = (fields) => {
    if (!user.value) return
    Object.assign(user.value, fields)
  }

  /**
   * 重置（退出登录用，目前静默登录不需要）
   */
  const reset = () => {
    user.value = null
    initialized.value = false
    loading.value = false
    error.value = ''
  }

  return {
    user,
    loading,
    initialized,
    error,
    isLoggedIn,
    childDisplayName,
    doLogin,
    updateUser,
    reset
  }
})
