<template>
  <view class="status-card" :class="cardClass" @click="$emit('click')">
    <view class="sc-stripe" :class="stripeClass"></view>
    <text class="sc-icon">{{ icon }}</text>
    <text class="sc-label">{{ label }}</text>
    <view class="sc-value">
      <slot name="value">
        <text>{{ value }}</text>
      </slot>
    </view>
    <view v-if="showBadge" class="sc-badge" :class="badgeClass"></view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: { type: String, default: '' },
  label: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  status: {
    type: String,
    default: 'default', // 'done' | 'todo' | 'warning' | 'default'
    validator: (v) => ['done', 'todo', 'warning', 'default'].includes(v)
  }
})

defineEmits(['click'])

const cardClass = computed(() => {
  if (props.status === 'done') return 'card-done'
  if (props.status === 'warning') return 'card-warning'
  return ''
})

const stripeClass = computed(() => {
  if (props.status === 'done') return 'green'
  if (props.status === 'warning') return 'amber'
  return 'blue'
})

const badgeClass = computed(() => {
  if (props.status === 'done') return 'done'
  if (props.status === 'todo') return 'todo'
  if (props.status === 'warning') return 'warning'
  return ''
})

const showBadge = computed(() => {
  return ['done', 'todo', 'warning'].includes(props.status)
})
</script>

<style lang="scss" scoped>
.status-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(56,62,72,0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;

  &:active {
    transform: scale(0.97);
    box-shadow: 0 4px 16px rgba(56,62,72,0.08);
  }
}

.sc-stripe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;

  &.green { background: #52B788; }
  &.amber { background: #D4A843; }
  &.blue { background: #4A90D9; }
}

.sc-icon {
  font-size: 26px;
  margin-bottom: 8px;
  display: block;
}

.sc-label {
  font-size: 12px;
  color: #7A828E;
  font-weight: 500;
}

.sc-value {
  font-size: 26px;
  font-weight: 700;
  color: #383E48;
  margin-top: 2px;
}

.sc-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 10px;
  height: 10px;
  border-radius: 50%;

  &.done {
    background: #52B788;
    box-shadow: 0 0 0 3px #EDF7F1;
  }
  &.todo {
    background: #D4A843;
    box-shadow: 0 0 0 3px #FBF5E8;
  }
  &.warning {
    background: #D9534F;
    box-shadow: 0 0 0 3px #FCEEED;
  }
}
</style>