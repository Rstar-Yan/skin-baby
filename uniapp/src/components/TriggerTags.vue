<template>
  <view class="trigger-section">
    <view class="trigger-title">
      <text>⚠️ 疑似诱因（多选，帮助发现发作规律）</text>
    </view>

    <view v-for="cat in categories" :key="cat.id" class="trigger-cat">
      <view class="trigger-cat-label">
        <text>{{ cat.icon }} {{ cat.name }}</text>
      </view>
      <view class="trigger-tags">
        <text
          v-for="tag in cat.tags"
          :key="tag"
          class="trigger-tag"
          :class="{ selected: isSelected(cat.id, tag) }"
          @click="toggleTag(cat.id, tag)"
        >
          {{ tag }}
        </text>
      </view>
    </view>

    <input
      class="trigger-custom"
      placeholder="补充其他诱因（选填）"
      :value="customValue"
      @input="onCustomInput"
    />
  </view>
</template>

<script setup>
import { triggerCategories } from '@/utils/mock-data.js'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  customValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'update:customValue'])

const categories = triggerCategories

const isSelected = (catId, tag) => {
  return props.modelValue.includes(`${catId}:${tag}`)
}

const toggleTag = (catId, tag) => {
  const key = `${catId}:${tag}`
  const newVal = [...props.modelValue]
  const idx = newVal.indexOf(key)
  if (idx >= 0) {
    newVal.splice(idx, 1)
  } else {
    newVal.push(key)
  }
  emit('update:modelValue', newVal)
}

const onCustomInput = (e) => {
  emit('update:customValue', e.detail.value)
}
</script>

<style lang="scss" scoped>
.trigger-section {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(56,62,72,0.06);
  margin-bottom: 12px;
}

.trigger-title {
  font-size: 13px;
  font-weight: 600;
  color: #D9534F;
  margin-bottom: 12px;
}

.trigger-cat {
  margin-bottom: 12px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.trigger-cat-label {
  font-size: 11px;
  font-weight: 600;
  color: #7A828E;
  margin-bottom: 6px;
}

.trigger-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.trigger-tag {
  padding: 5px 12px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;
  background: #F0F2F5;
  color: #7A828E;
  border: 1.5px solid transparent;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.94);
  }

  &.selected {
    background: #FCEEED;
    color: #D9534F;
    border-color: #D9534F;
  }
}

.trigger-custom {
  margin-top: 10px;
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #E8ECF0;
  font-size: 12px;
  color: #383E48;
  background: #F8F9FB;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: #9AA0A6;
  }
}
</style>