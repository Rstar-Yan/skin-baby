<template>
  <view class="slider-wrap">
    <view class="slider-header">
      <text class="title">瘙痒评分（NRS）</text>
      <text class="score">{{ modelValue }}</text>
    </view>

    <view
      class="slider-body"
      @click="onClick"
    >
      <view class="slider-rail"></view>
      <view
        class="slider-thumb"
        :style="{ left: thumbLeft }"
      >
        {{ modelValue }}
      </view>
    </view>

    <view class="slider-ticks">
      <view
        v-for="n in 11"
        :key="n - 1"
        class="tick"
        @click="setScore(n - 1)"
      >
        <text class="tick-val" :class="{ active: modelValue === n - 1 }">{{ n - 1 }}</text>
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

const setScore = (val) => {
  emit('update:modelValue', val)
}

const onClick = (e) => {
  const query = uni.createSelectorQuery()
  query.select('.slider-body').boundingClientRect().exec((res) => {
    if (!res || !res[0]) return
    const rect = res[0]
    const pct = (e.detail.x - rect.left) / rect.width
    const score = Math.round(Math.max(0, Math.min(1, pct)) * 10)
    emit('update:modelValue', score)
  })
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
  margin-bottom: 4px;
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
  transition: left 0.15s ease;
}

.slider-ticks {
  display: flex;
  justify-content: space-between;
  padding: 0 2px;

  .tick {
    width: 18px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.tick-val {
  font-size: 10px;
  color: #9AA0A6;
  width: 18px;
  text-align: center;
  padding: 2px 0;
  border-radius: 9999px;

  &.active {
    color: #4A90D9;
    font-weight: 700;
    font-size: 12px;
    background: #EBF2FA;
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
