<template>
  <view class="body-map">
    <view class="body-map-title">选择受累部位（可多选）</view>
    <view class="body-svg-wrap">
      <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
        <!-- Body outline -->
        <ellipse cx="100" cy="28" rx="28" ry="22" fill="#EBF2FA" stroke="#D5DAE0" stroke-width="1.5"/>
        <line x1="100" y1="50" x2="100" y2="100" stroke="#D5DAE0" stroke-width="1.5"/>
        <rect x="72" y="60" width="56" height="80" rx="16" fill="#F5F6F8" stroke="#D5DAE0" stroke-width="1.5"/>
        <line x1="72" y1="78" x2="44" y2="108" stroke="#D5DAE0" stroke-width="1.5"/>
        <line x1="128" y1="78" x2="156" y2="108" stroke="#D5DAE0" stroke-width="1.5"/>
        <line x1="44" y1="108" x2="36" y2="150" stroke="#D5DAE0" stroke-width="1.5"/>
        <line x1="156" y1="108" x2="164" y2="150" stroke="#D5DAE0" stroke-width="1.5"/>
        <line x1="100" y1="140" x2="80" y2="194" stroke="#D5DAE0" stroke-width="1.5"/>
        <line x1="100" y1="140" x2="120" y2="194" stroke="#D5DAE0" stroke-width="1.5"/>

        <!-- Clickable dots -->
        <circle
          v-for="dot in dots"
          :key="dot.id"
          class="body-dot"
          :class="{ selected: isSelected(dot.id) }"
          :cx="dot.cx"
          :cy="dot.cy"
          r="9"
          :fill="isSelected(dot.id) ? '#D9534F' : '#B0B8C4'"
          :stroke="isSelected(dot.id) ? '#fff' : 'transparent'"
          :stroke-width="isSelected(dot.id) ? 3 : 0"
          :data-id="dot.id"
          @click="onDotClick(dot.id)"
        />

        <!-- Labels -->
        <text class="body-label" x="45" y="14">头顶</text>
        <text class="body-label" x="38" y="34">面部</text>
        <text class="body-label" x="38" y="60">颈部</text>
        <text class="body-label" x="28" y="124">手肘</text>
        <text class="body-label" x="12" y="158">手腕</text>
        <text class="body-label" x="28" y="200">膝盖</text>
        <text class="body-label" x="28" y="244">脚踝</text>
      </svg>
    </view>

    <!-- Selected Areas Tags -->
    <view class="selected-areas" v-if="displayAreas.length > 0">
      <view
        v-for="area in displayAreas"
        :key="area"
        class="area-tag"
        @click="removeArea(area)"
      >
        {{ area }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { bodyAreas } from '@/utils/mock-data.js'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const dots = ref(bodyAreas)
const selectedNames = ref([...props.modelValue])

watch(() => props.modelValue, (val) => {
  selectedNames.value = [...val]
}, { deep: true })

const isSelected = (id) => {
  const dot = dots.value.find(d => d.id === id)
  return dot && selectedNames.value.includes(dot.name)
}

const displayAreas = computed(() => selectedNames.value)

const toggleName = (name) => {
  const idx = selectedNames.value.indexOf(name)
  if (idx >= 0) {
    selectedNames.value.splice(idx, 1)
  } else {
    selectedNames.value.push(name)
  }
  emit('update:modelValue', [...selectedNames.value])
}

const onDotClick = (id) => {
  const dot = dots.value.find(d => d.id === id)
  if (dot) {
    toggleName(dot.name)
  }
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
  margin-bottom: 10px;
}

.body-svg-wrap {
  width: 100%;
  height: 400rpx;
  position: relative;

  svg {
    width: 100%;
    height: 100%;
  }
}

.body-dot {
  cursor: pointer;
  transition: all 0.25s ease;
}

.body-label {
  font-size: 9px;
  fill: #7A828E;
  pointer-events: none;
  font-weight: 500;
}

.selected-areas {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 10px;
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
</style>
