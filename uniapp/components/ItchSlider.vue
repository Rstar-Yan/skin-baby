<template>
  <view class="slider-wrap">
    <view class="slider-header">
      <text class="title">瘙痒评分（NRS）</text>
      <text class="score">{{ modelValue }}</text>
    </view>

    <view
      class="slider-body"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @click="onRailClick"
    >
      <view class="slider-rail"></view>
      <view
        class="slider-thumb"
        :style="{ left: thumbLeft }"
        @touchstart.stop.prevent="onThumbTouchStart"
        @touchmove.stop.prevent="onThumbTouchMove"
        @touchend.stop.prevent="onThumbTouchEnd"
      >
        {{ modelValue }}
      </view>
    </view>

    <view class="slider-ticks">
      <text>0</text><text>1</text><text>2</text><text>3</text><text>4</text>
      <text>5</text><text>6</text><text>7</text><text>8</text><text>9</text><text>10</text>
    </view>

    <text class="slider-desc" :class="descClass">{{ descText }}</text>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 6
  }
})

const emit = defineEmits(['update:modelValue'])

const dragging = ref(false)

const thumbLeft = computed(() => (props.modelValue / 10 * 100) + '%')

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

const getPct = (clientX, railEl) => {
  return new Promise((resolve) => {
    const query = uni.createSelectorQuery().in(railEl)
    query.select('.slider-body').boundingClientRect(rect => {
      if (!rect) { resolve(0); return }
      const pct = (clientX - rect.left) / rect.width
      resolve(Math.max(0, Math.min(1, pct)))
    }).exec()
  })
}

// In uni-app, we handle touch events via @touchstart etc.
const setScoreByPct = (pct) => {
  const score = Math.round(pct * 10)
  emit('update:modelValue', score)
}

// Using simple click-based interaction for reliability in mini-program
const onRailClick = (e) => {
  // In mini-program, the touch position is in e.detail
  if (e.detail && e.detail.x !== undefined) {
    // e.detail.x is relative to the component
  }
  // Use a more reliable approach with boundingClientRect
  const query = uni.createSelectorQuery().in(this)
  query.select('.slider-body').boundingClientRect().exec((res) => {
    if (!res || !res[0]) return
    const rect = res[0]
    const clientX = e.detail.x || e.touches?.[0]?.clientX || 0
    const pct = (clientX - rect.left) / rect.width
    setScoreByPct(pct)
  })
}

// Refs for direct DOM manipulation in touch handlers
const updateFromEvent = (e, useTouches = true) => {
  const query = uni.createSelectorQuery().in(this)
  query.select('.slider-body').boundingClientRect().exec((res) => {
    if (!res || !res[0]) return
    const rect = res[0]
    const clientX = useTouches && e.touches?.[0] ? e.touches[0].clientX : (e.detail?.x || 0)
    const pct = (clientX - rect.left) / rect.width
    setScoreByPct(pct)
  })
}

const onTouchStart = (e) => {
  if (e.touches && e.touches[0]) {
    const query = uni.createSelectorQuery().in(this)
    query.select('.slider-body').boundingClientRect().exec((res) => {
      if (!res || !res[0]) return
      const rect = res[0]
      const pct = (e.touches[0].clientX - rect.left) / rect.width
      setScoreByPct(pct)
    })
  }
}

const onTouchMove = (e) => {
  if (e.touches && e.touches[0]) {
    const query = uni.createSelectorQuery().in(this)
    query.select('.slider-body').boundingClientRect().exec((res) => {
      if (!res || !res[0]) return
      const rect = res[0]
      const pct = (e.touches[0].clientX - rect.left) / rect.width
      setScoreByPct(pct)
    })
  }
}

const onTouchEnd = () => {}

const onThumbTouchStart = (e) => {
  dragging.value = true
}

const onThumbTouchMove = (e) => {
  if (!dragging.value) return
  if (e.touches && e.touches[0]) {
    const query = uni.createSelectorQuery().in(this)
    query.select('.slider-body').boundingClientRect().exec((res) => {
      if (!res || !res[0]) return
      const rect = res[0]
      const pct = (e.touches[0].clientX - rect.left) / rect.width
      setScoreByPct(pct)
    })
  }
}

const onThumbTouchEnd = () => {
  dragging.value = false
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
    font-size: 38px;
    font-weight: 700;
    color: #383E48;
    line-height: 1;
  }
}

.slider-body {
  position: relative;
  height: 40px;
}

.slider-rail {
  position: absolute;
  top: 14px;
  left: 0;
  right: 0;
  height: 10px;
  border-radius: 5px;
  background: linear-gradient(to right, #52B788, #D4A843, #D9534F);
}

.slider-thumb {
  position: absolute;
  top: 2px;
  width: 34px;
  height: 34px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(56,62,72,0.2);
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #383E48;
  z-index: 2;
}

.slider-ticks {
  display: flex;
  justify-content: space-between;
  padding: 0 2px;
  margin-top: 2px;

  text {
    font-size: 9px;
    color: #9AA0A6;
    width: 16px;
    text-align: center;
  }
}

.slider-desc {
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin-top: 8px;
  color: #7A828E;

  &.none { color: #52B788; }
  &.mild { color: #D4A843; }
  &.severe { color: #D9534F; }
}
</style>