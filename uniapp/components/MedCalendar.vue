<template>
  <view class="med-calendar">
    <view class="med-cal-title">用药日历 · {{ cal.year }}年{{ cal.month }}月</view>
    
    <view class="weekday-row">
      <text v-for="d in weekdays" :key="d">{{ d }}</text>
    </view>

    <view v-for="(row, ri) in calRows" :key="ri" class="cal-row">
      <view
        v-for="(day, di) in row"
        :key="di"
        class="cal-day"
        :class="{
          empty: day.empty,
          today: day.today,
          'med-day': day.med
        }"
      >
        <text v-if="!day.empty">{{ day.day }}</text>
      </view>
    </view>

    <view class="cal-legend">
      <view class="legend-item">
        <view class="cal-dot red"></view>
        <text>激素用药日</text>
      </view>
      <view class="legend-item">
        <view class="cal-dot blue"></view>
        <text>今天</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { medicationCalendar } from '@/utils/mock-data.js'

const cal = ref(medicationCalendar)
const weekdays = ['日', '一', '二', '三', '四', '五', '六']
const calRows = ref([])

const buildCalendar = () => {
  const { startDay, totalDays, today, medDays } = cal.value
  const medSet = new Set(medDays)
  const rows = []
  let row = []

  for (let i = 0; i < startDay; i++) {
    row.push({ empty: true })
  }

  for (let d = 1; d <= totalDays; d++) {
    row.push({
      day: d,
      today: d === today,
      med: medSet.has(d),
      empty: false
    })
    if (row.length === 7 || d === totalDays) {
      rows.push(row)
      row = []
    }
  }

  if (row.length > 0) rows.push(row)
  calRows.value = rows
}

onMounted(() => {
  buildCalendar()
})
</script>

<style lang="scss" scoped>
.med-calendar {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(56,62,72,0.06);
}

.med-cal-title {
  font-size: 14px;
  font-weight: 600;
  color: #383E48;
  margin-bottom: 12px;
}

.weekday-row {
  display: flex;
  margin-bottom: 4px;

  text {
    flex: 1;
    text-align: center;
    font-size: 10px;
    color: #9AA0A6;
    font-weight: 500;
  }
}

.cal-row {
  display: flex;
  gap: 1px;
  margin-bottom: 1px;
}

.cal-day {
  flex: 1;
  aspect-ratio: 1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #383E48;
  position: relative;

  &.empty {
    cursor: default;
  }

  &.today {
    background: #EBF2FA;
    color: #4A90D9;
  }

  &.med-day {
    background: #FCEEED;
    color: #D9534F;
  }

  &.med-day::after {
    content: '';
    position: absolute;
    bottom: 2px;
    width: 4px;
    height: 4px;
    background: #D9534F;
    border-radius: 50%;
  }
}

.cal-legend {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  font-size: 11px;
  color: #7A828E;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cal-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &.red { background: #D9534F; }
  &.blue { background: #4A90D9; }
}
</style>