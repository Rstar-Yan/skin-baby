import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { recordsApi, moisturizeApi } from '@/utils/cloud.js'

export const useRecordStore = defineStore('record', () => {
  // 状态
  const selectedAreas = ref([])
  const selectedTriggers = ref([])
  const customTrigger = ref('')
  const itchScore = ref(6)
  const records = ref([])
  const loading = ref(false)
  const todayStatus = ref(null)
  const weekTrend = ref(null)
  const recentPhotos = ref([])

  // 计算属性
  const selectedTriggerCount = computed(() => selectedTriggers.value.length)
  const itchDescription = computed(() => {
    const score = itchScore.value
    if (score <= 2) return { text: '基本不痒，继续保持', class: 'none' }
    if (score <= 5) return { text: '轻度瘙痒，日常润肤即可', class: 'mild' }
    if (score <= 7) return { text: '中度瘙痒，建议冷敷缓解', class: 'mild' }
    return { text: '重度瘙痒，请考虑就医', class: 'severe' }
  })

  // 格式化日期
  function getDateStr(d) {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 获取问候语
  const greeting = computed(() => {
    const hour = new Date().getHours()
    if (hour < 6) return '凌晨好'
    if (hour < 12) return '上午好'
    if (hour < 18) return '下午好'
    return '晚上好'
  })

  // 方法

  /** 加载今日状态 */
  async function loadTodayStatus() {
    try {
      const res = await moisturizeApi.today()
      if (res.code === 0) {
        todayStatus.value = res.data
      }
    } catch (err) {
      console.error('加载今日状态失败:', err)
    }
  }

  /** 润肤打卡 */
  async function doMoisturize(productName = '') {
    const res = await moisturizeApi.checkin(productName, selectedAreas.value)
    if (res.code === 0) {
      // 刷新今日状态
      await loadTodayStatus()
    }
    return res
  }

  /** 保存症状记录 */
  async function saveRecord() {
    loading.value = true
    try {
      const data = {
        areas: [...selectedAreas.value],
        triggers: [...selectedTriggers.value],
        customTrigger: customTrigger.value,
        itchScore: itchScore.value
      }
      const res = await recordsApi.create(data)
      if (res.code === 0) {
        records.value.unshift(res.data)
        // 刷新今日状态和照片列表
        await Promise.all([loadTodayStatus(), loadRecentPhotos()])
        return { success: true, data: res.data }
      }
      return { success: false, error: res.message }
    } catch (err) {
      console.error('保存记录失败:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /** 加载记录列表 */
  async function fetchRecords(page = 1) {
    loading.value = true
    try {
      const res = await recordsApi.list(page)
      if (res.code === 0) {
        if (page === 1) {
          records.value = res.data.list
        } else {
          records.value = [...records.value, ...res.data.list]
        }
        return res.data
      }
    } catch (err) {
      console.error('获取记录失败:', err)
    } finally {
      loading.value = false
    }
  }

  /** 加载本周趋势 */
  async function loadWeekTrend() {
    try {
      const res = await recordsApi.weekTrend()
      if (res.code === 0) {
        weekTrend.value = res.data
      }
    } catch (err) {
      console.error('加载趋势失败:', err)
    }
  }

  /** 加载最近照片 */
  async function loadRecentPhotos() {
    try {
      const res = await recordsApi.recentPhotos()
      if (res.code === 0) {
        recentPhotos.value = res.data
      }
    } catch (err) {
      console.error('加载照片失败:', err)
    }
  }

  /** 清空表单 */
  function clearRecord() {
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
    todayStatus,
    weekTrend,
    recentPhotos,

    // 计算属性
    selectedTriggerCount,
    itchDescription,
    greeting,

    // 方法
    loadTodayStatus,
    doMoisturize,
    saveRecord,
    fetchRecords,
    loadWeekTrend,
    loadRecentPhotos,
    clearRecord
  }
})
