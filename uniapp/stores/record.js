import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useRecordStore = defineStore('record', () => {
  // 状态
  const selectedAreas = ref([])
  const selectedTriggers = ref([])
  const customTrigger = ref('')
  const itchScore = ref(6)
  const records = ref([])

  // 计算属性
  const selectedTriggerCount = computed(() => selectedTriggers.value.length)
  const itchDescription = computed(() => {
    const score = itchScore.value
    if (score <= 2) return { text: '基本不痒，继续保持', class: 'none' }
    if (score <= 5) return { text: '轻度瘙痒，日常润肤即可', class: 'mild' }
    if (score <= 7) return { text: '中度瘙痒，建议冷敷缓解', class: 'mild' }
    return { text: '重度瘙痒，请考虑就医', class: 'severe' }
  })

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

  const saveRecord = () => {
    const record = {
      id: Date.now(),
      date: new Date().toISOString(),
      areas: [...selectedAreas.value],
      triggers: [...selectedTriggers.value],
      customTrigger: customTrigger.value,
      itchScore: itchScore.value,
      itchDescription: itchDescription.value
    }
    records.value.unshift(record)
    return record
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
    
    // 计算属性
    selectedTriggerCount,
    itchDescription,
    
    // 方法
    toggleArea,
    toggleTrigger,
    isTriggerSelected,
    saveRecord,
    clearRecord
  }
})