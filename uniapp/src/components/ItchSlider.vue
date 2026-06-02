<template>
  <view class="slider-wrap">
    <view class="slider-header">
      <text class="title">瘙痒评分（NRS）</text>
      <text class="score" :class="scoreColor">{{ modelValue }}</text>
    </view>

    <!-- Score buttons: click directly -->
    <view class="score-grid">
      <view
        v-for="n in 11"
        :key="n - 1"
        class="score-btn"
        :class="{ active: modelValue === n - 1 }"
        @click="setScore(n - 1)"
      >
        <text class="sbtn-val">{{ n - 1 }}</text>
      </view>
    </view>

    <!-- Slider rail (visual only) -->
    <view class="slider-rail-wrap">
      <view class="slider-rail">
        <view class="slider-fill" :style="{ width: fillPercent + '%' }"></view>
      </view>
      <view class="slider-thumb" :style="{ left: fillPercent + '%' }">
        <text class="thumb-label">痒</text>
      </view>
    </view>

    <text class="slider-desc" :class="descClass">{{ descText }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 6
  }
})

const emit = defineEmits(['update:modelValue'])

const fillPercent = computed(() => (props.modelValue / 10 * 100))

const descText = computed(() => {
  const score = props.modelValue
  if (score <= 2) return '基本不痒，继续保持'
  if (score <= 5) return '轻度瘙痒，日常润肤即可'
  if (score <= 7) return '中度瘙痒，建议冷敷缓解'
  return '重度瘙痒，请考虑就医'
})

const descClass = computed(() => {
  const score = props.modelValue
  if (score <= 2) return 'none'
  if (score <= 7) return 'mild'
  return 'severe'
})

const scoreColor = computed(() => {
  const s = props.modelValue
  if (s <= 2) return 'color-low'
  if (s <= 5) return 'color-mid'
  if (s <= 7) return 'color-high'
  return 'color-severe'
})

const setScore = (val) => {
  emit('update:modelValue', val)
}
</script>

<style lang="scss" scoped>
.slider-wrap {
  background: #fff;
  border-radius: 14px;
  padding: 20px 16px;
  box-shadow: 0 1px 3px rgba(56,62,72,0.06);
  margin-bottom: 12px;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;

  .title {
    font-size: 14px;
    font-weight: 600;
    color: #383E48;
  }

  .score {
    font-size: 40px;
    font-weight: 800;
    line-height: 1;
    color: #383E48;
    transition: color 0.3s ease;

    &.color-low { color: #52B788; }
    &.color-mid { color: #D4A843; }
    &.color-high { color: #E68A2E; }
    &.color-severe { color: #D9534F; }
  }
}

.score-grid {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.score-btn {
  width: 26px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #EDF0F4;
  background: #FAFBFC;
  transition: all 0.2s ease;

  &.active {
    background: #4A90D9;
    border-color: #4A90D9;
  }

  &:active {
    transform: scale(0.85);
  }
}

.sbtn-val {
  font-size: 12px;
  font-weight: 700;
  color: #7A828E;

  .active & {
    color: #fff;
  }
}

.slider-rail-wrap {
  position: relative;
  height: 30px;
  margin-bottom: 8px;
}

.slider-rail {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 8px;
  transform: translateY(-50%);
  border-radius: 4px;
  background: #EDF0F4;
  overflow: hidden;
}

.slider-fill {
  height: 100%;
  background: linear-gradient(to right, #52B788, #D4A843, #D9534F);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.slider-thumb {
  position: absolute;
  top: 50%;
  width: 28px;
  height: 28px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(56,62,72,0.15);
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left 0.3s ease;
  z-index: 2;
}

.thumb-label {
  font-size: 11px;
  font-weight: 700;
  color: #383E48;
}

.slider-desc {
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin-top: 4px;
  color: #7A828E;

  &.none { color: #52B788; }
  &.mild { color: #D4A843; }
  &.severe { color: #D9534F; }
}
</style>
