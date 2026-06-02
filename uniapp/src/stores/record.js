import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { callCloudFunction, login } from '@/utils/cloud.js'

export const useRecordStore = defineStore('record', () => {
  // 状态
  const selectedAreas = ref([])
  const selectedTriggers = ref([])
  const customTrigger = ref('')
  const itchScore = ref(6)
  const records = ref([])
  const loading = ref(false)
  const user = ref(null)

  // 计算属性
  const selectedTriggerCount = computed(() => selectedTriggers.value.length)
  const itchDescription = computed(() => {
    const score = itchScore.value
    if (score <= 2) return { text: '基本不痒，继续保持', class: 'none' }
    if (score <= 5) return { text: '轻度瘙痒，日常润肤即可', class: 'mild' }
    if (score <= 7) return { text: '中度瘙痒，建议冷敷缓解', class: 'mild' }
    return { text: '重度瘙痒，请考虑就医', class: 'severe' }
  })

  // 微信登录
  const doLogin = async () => {
    try {
      const data = await login()
      user.value = data
      return data
    } catch (err) {
      console.error('登录失败:', err)
      return null
    }
  }

  // 方法
  const toggleArea = (areaName) => {
    const idx = selectedAreas.value.indexOf(areaName)
    if (idx >= 0) {
      selectedAreas.value.splice(idx, 1)
    } else {
      selectedAreas.value.push(areaName)
    }
  }

  const toggleTrigger = (catId, tag) => {
    const key = `${catId}:${tag}`
    const idx = selectedTriggers.value.indexOf(key)
    if (idx >= 0) {
      selectedTriggers.value.splice(idx, 1)
    } else {
      selectedTriggers.value.push(key)
    }
  }

  const isTriggerSelected = (catId, tag) => {
    return selectedTriggers.value.includes(`${catId}:${tag}`)
  }

  const saveRecord = async () => {
    const record = {
      areas: [...selectedAreas.value],
      triggers: [...selectedTriggers.value],
      customTrigger: customTrigger.value,
      itchScore: itchScore.value,
      itchDescription: itchDescription.value.text
    }

    // 保存到云数据库
    try {
      const result = await callCloudFunction('records', {
        action: 'create',
        data: record
      })
      if (result.code === 0) {
        record._id = result.data.id
        record.createdAt = new Date().toISOString()
        records.value.unshift(record)
      }
    } catch (err) {
      console.error('保存记录失败:', err)
    }

    return record
  }

  const fetchRecords = async () => {
    loading.value = true
    try {
      const result = await callCloudFunction('records', { action: 'list' })
      if (result.code === 0) {
        records.value = result.data.list || []
      }
    } catch (err) {
      console.error('获取记录失败:', err)
    } finally {
      loading.value = false
    }
  }

  const clearRecord = () => {
    selectedAreas.value = []
    selectedTriggers.value = []
    customTrigger.value = ''
    itchScore.value = 6
  }

  return {
    // 状态
    selectedAreas,
    selectedTriggers,
    customTrigger,
    itchScore,
    records,
    loading,
    user,

    // 计算属性
    selectedTriggerCount,
    itchDescription,

    // 方法
    toggleArea,
    toggleTrigger,
    isTriggerSelected,
    saveRecord,
    fetchRecords,
    clearRecord,
    doLogin
  }
})
