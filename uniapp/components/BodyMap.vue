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
import { ref, computed } from 'vue'
import { bodyAreas } from '@/utils/mock-data.js'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const dots = ref(bodyAreas)
const selectedIds = ref([])

// Initialize from modelValue if needed
const initFromModelValue = () => {
  if (props.modelValue.length > 0) {
    const ids = []
    props.modelValue.forEach(name => {
      dots.value.filter(d => d.name === name).forEach(d => ids.push(d.id))
    })
    selectedIds.value = ids
  }
}
initFromModelValue()

const isSelected = (id) => selectedIds.value.includes(id)

const displayAreas = computed(() => {
  const areas = []
  const seen = new Set()
  selectedIds.value.forEach(sid => {
    const dot = dots.value.find(d => d.id === sid)
    if (dot && !seen.has(dot.name)) {
      seen.add(dot.name)
      areas.push(dot.name)
    }
  })
  return areas
})

const onSvgClick = (e) => {
  const circle = e.target.closest('circle')
  if (!circle) return
  const id = circle.getAttribute('data-id')
  if (!id) return
  
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) {
    selectedIds.value.splice(idx, 1)
  } else {
    selectedIds.value.push(id)
  }
  
  // Build unique area names
  const areas = []
  const seen = new Set()
  selectedIds.value.forEach(sid => {
    const dot = dots.value.find(d => d.id === sid)
    if (dot && !seen.has(dot.name)) {
      seen.add(dot.name)
      areas.push(dot.name)
    }
  })
  
  emit('update:modelValue', areas)
}

const removeArea = (areaName) => {
  // Remove all dots with this name
  dots.value.filter(d => d.name === areaName).forEach(d => {
    const idx = selectedIds.value.indexOf(d.id)
    if (idx >= 0) selectedIds.value.splice(idx, 1)
  })
  
  const areas = []
  const seen = new Set()
  selectedIds.value.forEach(sid => {
    const dot = dots.value.find(d => d.id === sid)
    if (dot && !seen.has(dot.name)) {
      seen.add(dot.name)
      areas.push(dot.name)
    }
  })
  emit('update:modelValue', areas)
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