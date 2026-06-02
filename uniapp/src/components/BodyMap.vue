<template>
  <view class="body-map">
    <view class="body-map-title">选择受累部位（可多选，点击部位选中/取消）</view>
    <view class="areas-grid">
      <view
        v-for="dot in dots"
        :key="dot.id"
        class="area-btn"
        :class="{ selected: isSelected(dot.id) }"
        @click="onDotClick(dot.id)"
      >
        <text class="area-icon">{{ dot.emoji }}</text>
        <text class="area-label">{{ dot.name }}</text>
      </view>
    </view>

    <!-- Selected Areas Tags -->
    <view class="selected-areas" v-if="displayAreas.length > 0">
      <view
        v-for="area in displayAreas"
        :key="area"
        class="area-tag"
        @click="removeArea(area)"
      >
        {{ area }} ✕
      </view>
    </view>
    <view v-else class="empty-hint">点击上方部位进行选择</view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const dots = ref([
  { id: 'top_head', name: '头顶', emoji: '🪣' },
  { id: 'face', name: '面部', emoji: '😊' },
  { id: 'neck', name: '颈部', emoji: '🧣' },
  { id: 'torso', name: '躯干', emoji: '👕' },
  { id: 'elbow', name: '肘窝', emoji: '💪' },
  { id: 'wrist', name: '手腕', emoji: '✋' },
  { id: 'knee', name: '膝盖窝', emoji: '🦵' },
  { id: 'ankle', name: '脚踝', emoji: '🦶' }
])

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])
const selectedNames = ref([...props.modelValue])

watch(() => props.modelValue, (val) => {
  selectedNames.value = [...val]
}, { deep: true })

const isSelected = (id) => {
  const dot = dots.value.find(d => d.id === id)
  return dot && selectedNames.value.includes(dot.name)
}

const displayAreas = computed(() => selectedNames.value)

const onDotClick = (id) => {
  const dot = dots.value.find(d => d.id === id)
  if (!dot) return
  const idx = selectedNames.value.indexOf(dot.name)
  if (idx >= 0) {
    selectedNames.value.splice(idx, 1)
  } else {
    selectedNames.value.push(dot.name)
  }
  emit('update:modelValue', [...selectedNames.value])
}

const removeArea = (areaName) => {
  const idx = selectedNames.value.indexOf(areaName)
  if (idx >= 0) {
    selectedNames.value.splice(idx, 1)
  }
  emit('update:modelValue', [...selectedNames.value])
}
</script>

<style lang="scss" scoped>
.body-map {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(56,62,72,0.06);
  margin-bottom: 12px;
}

.body-map-title {
  font-size: 13px;
  font-weight: 600;
  color: #7A828E;
  margin-bottom: 12px;
}

.areas-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 8px;
}

.area-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 6px;
  border-radius: 10px;
  background: #F5F6F8;
  border: 1.5px solid transparent;
  transition: all 0.2s ease;
  min-height: 60px;

  &.selected {
    background: #FCEEED;
    border-color: #D9534F;
  }

  &:active {
    transform: scale(0.93);
  }
}

.area-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.area-label {
  font-size: 11px;
  font-weight: 600;
  color: #383E48;
}

.selected-areas {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 12px;
  min-height: 28px;
}

.area-tag {
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  background: #FCEEED;
  color: #D9534F;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.93);
    opacity: 0.7;
  }
}

.empty-hint {
  font-size: 11px;
  color: #B0B8C4;
  margin-top: 10px;
  text-align: center;
}
</style>
