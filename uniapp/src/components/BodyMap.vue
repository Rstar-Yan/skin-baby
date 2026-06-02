<template>
  <view class="body-map">
    <view class="body-map-title">选择受累部位（可多选）</view>
    <view class="body-svg-wrap">
      <svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" @click="onSvgClick">
        <!-- Body outline -->
        <ellipse cx="100" cy="28" rx="28" ry="22" fill="oklch(0.95 0.01 251)" stroke="oklch(0.85 0.02 251)" stroke-width="1.5"/>
        <line x1="100" y1="50" x2="100" y2="100" stroke="oklch(0.85 0.02 251)" stroke-width="1.5"/>
        <rect x="72" y="60" width="56" height="80" rx="16" fill="oklch(0.96 0.01 251)" stroke="oklch(0.85 0.02 251)" stroke-width="1.5"/>
        <line x1="72" y1="78" x2="44" y2="108" stroke="oklch(0.85 0.02 251)" stroke-width="1.5"/>
        <line x1="128" y1="78" x2="156" y2="108" stroke="oklch(0.85 0.02 251)" stroke-width="1.5"/>
        <line x1="44" y1="108" x2="36" y2="150" stroke="oklch(0.85 0.02 251)" stroke-width="1.5"/>
        <line x1="156" y1="108" x2="164" y2="150" stroke="oklch(0.85 0.02 251)" stroke-width="1.5"/>
        <line x1="100" y1="140" x2="80" y2="194" stroke="oklch(0.85 0.02 251)" stroke-width="1.5"/>
        <line x1="100" y1="140" x2="120" y2="194" stroke="oklch(0.85 0.02 251)" stroke-width="1.5"/>

        <!-- Dots with labels -->
        <g v-for="dot in dots" :key="dot.id">
          <circle
            class="body-dot"
            :class="{ selected: isSelected(dot.id), hint: dot.id === 'top_head' }"
            :cx="dot.cx"
            :cy="dot.cy"
            r="7"
            :fill="isSelected(dot.id) ? '#D9534F' : 'oklch(0.75 0.02 251)'"
            :stroke="isSelected(dot.id) ? '#fff' : 'transparent'"
            :stroke-width="isSelected(dot.id) ? 3 : 0"
            :data-id="dot.id"
          />
        </g>

        <!-- Labels for key dots -->
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

// 直接用选中的部位名称来管理
const selectedNames = ref([...props.modelValue])

// 同步外部变化
watch(() => props.modelValue, (val) => {
  selectedNames.value = [...val]
}, { deep: true })

const isSelected = (id) => {
  const dot = dots.value.find(d => d.id === id)
  return dot && selectedNames.value.includes(dot.name)
}

const displayAreas = computed(() => selectedNames.value)

const onSvgClick = (e) => {
  const circle = e.target.closest('circle')
  if (!circle) return
  const id = circle.getAttribute('data-id')
  if (!id) return

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

  &.selected {
    r: 10;
  }
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