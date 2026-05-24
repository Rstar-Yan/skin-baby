<template>
  <view class="page-trends">
    <!-- Trend Tabs -->
    <view class="trend-tabs">
      <view
        class="trend-tab"
        :class="{ active: activeTab === 'week' }"
        @click="activeTab = 'week'"
      >
        本周
      </view>
      <view
        class="trend-tab"
        :class="{ active: activeTab === 'month' }"
        @click="activeTab = 'month'"
      >
        本月
      </view>
    </view>

    <!-- Week Chart -->
    <view v-if="activeTab === 'week'" class="chart-card">
      <view class="chart-card-title">瘙痒评分趋势 · 本周</view>
      <canvas
        type="2d"
        id="weekChart"
        class="chart-canvas"
        @touchstart="onWeekChartTouch"
      ></canvas>
      <view class="chart-summary">
        <view class="chart-stat">
          <text class="stat-val" style="color:#D9534F">{{ weekData.highest }}</text>
          <text class="stat-label">最高评分</text>
        </view>
        <view class="chart-stat">
          <text class="stat-val">{{ weekData.average }}</text>
          <text class="stat-label">平均评分</text>
        </view>
        <view class="chart-stat">
          <text class="stat-val" style="color:#52B788">{{ weekData.lowest }}</text>
          <text class="stat-label">最低评分</text>
        </view>
      </view>
    </view>

    <!-- Month Chart -->
    <view v-if="activeTab === 'month'" class="chart-card">
      <view class="chart-card-title">瘙痒评分趋势 · 本月</view>
      <canvas
        type="2d"
        id="monthChart"
        class="chart-canvas"
        @touchstart="onMonthChartTouch"
      ></canvas>
      <view class="chart-summary">
        <view class="chart-stat">
          <text class="stat-val" style="color:#D9534F">{{ monthData.highest }}</text>
          <text class="stat-label">最高评分</text>
        </view>
        <view class="chart-stat">
          <text class="stat-val">{{ monthData.average }}</text>
          <text class="stat-label">平均评分</text>
        </view>
        <view class="chart-stat">
          <text class="stat-val" style="color:#52B788">{{ monthData.lowest }}</text>
          <text class="stat-label">最低评分</text>
        </view>
      </view>
    </view>

    <!-- Medication Calendar -->
    <MedCalendar />
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { itchTrendWeek, itchTrendMonth } from '@/utils/mock-data.js'
import MedCalendar from '@/components/MedCalendar.vue'

const activeTab = ref('week')
const weekData = ref(itchTrendWeek)
const monthData = ref(itchTrendMonth)

const drawChart = (canvasId, dataPoints) => {
  const query = uni.createSelectorQuery()
  query.select('#' + canvasId)
    .fields({ node: true, size: true })
    .exec((res) => {
      if (!res[0] || !res[0].node) {
        // Retry after a short delay for canvas to be ready
        setTimeout(() => drawChart(canvasId, dataPoints), 200)
        return
      }
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      const dpr = uni.getSystemInfoSync().pixelRatio
      const w = res[0].width
      const h = res[0].height

      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)

      const padLeft = 50
      const padRight = 20
      const padTop = 10
      const padBottom = 30
      const plotW = w - padLeft - padRight
      const plotH = h - padTop - padBottom
      const maxScore = 10

      ctx.clearRect(0, 0, w, h)

      // Grid lines
      ctx.strokeStyle = '#E8ECF0'
      ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        const y = padTop + (plotH / 4) * i
        ctx.beginPath()
        ctx.moveTo(padLeft, y)
        ctx.lineTo(w - padRight, y)
        ctx.stroke()
      }

      // Y-axis labels
      ctx.fillStyle = '#9AA0A6'
      ctx.font = '10px -apple-system'
      ctx.textAlign = 'right'
      for (let i = 0; i <= 4; i++) {
        const val = Math.round(10 - i * 2.5)
        const y = padTop + (plotH / 4) * i
        ctx.fillText(String(val), padLeft - 6, y + 4)
      }

      if (!dataPoints || dataPoints.length === 0) return

      const stepX = plotW / Math.max(dataPoints.length - 1, 1)

      // Area fill
      ctx.beginPath()
      const firstX = padLeft
      const firstY = padTop + plotH - (dataPoints[0].score / maxScore) * plotH
      ctx.moveTo(firstX, padTop + plotH)
      ctx.lineTo(firstX, firstY)

      dataPoints.forEach((pt, i) => {
        const x = padLeft + stepX * i
        const y = padTop + plotH - (pt.score / maxScore) * plotH
        ctx.lineTo(x, y)
      })

      const lastX = padLeft + stepX * (dataPoints.length - 1)
      ctx.lineTo(lastX, padTop + plotH)
      ctx.closePath()
      ctx.fillStyle = 'rgba(74,144,217,0.12)'
      ctx.fill()

      // Line
      ctx.beginPath()
      ctx.strokeStyle = '#4A90D9'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      dataPoints.forEach((pt, i) => {
        const x = padLeft + stepX * i
        const y = padTop + plotH - (pt.score / maxScore) * plotH
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()

      // Data dots
      dataPoints.forEach((pt, i) => {
        const x = padLeft + stepX * i
        const y = padTop + plotH - (pt.score / maxScore) * plotH
        ctx.beginPath()
        ctx.arc(x, y, 4.5, 0, Math.PI * 2)
        ctx.fillStyle = '#fff'
        ctx.fill()

        const isLast = i === dataPoints.length - 1
        ctx.strokeStyle = isLast ? '#D9534F' : '#4A90D9'
        ctx.lineWidth = 2.5
        ctx.stroke()

        // X-axis labels
        ctx.fillStyle = '#9AA0A6'
        ctx.font = '9px -apple-system'
        ctx.textAlign = 'center'
        ctx.fillText(pt.label, x, padTop + plotH + 18)
      })
    })
}

const drawWeekChart = () => {
  drawChart('weekChart', weekData.value.days)
}

const drawMonthChart = () => {
  const dataPoints = monthData.value.dates.map(d => ({
    label: d.label,
    score: d.score
  }))
  drawChart('monthChart', dataPoints)
}

const onWeekChartTouch = () => {
  drawWeekChart()
}

const onMonthChartTouch = () => {
  drawMonthChart()
}

onMounted(() => {
  // Delay drawing to ensure canvas element is rendered
  setTimeout(() => drawWeekChart(), 300)
})
</script>

<style lang="scss" scoped>
.page-trends {
  padding: 0 18px;
  padding-bottom: 24px;
}

.trend-tabs {
  display: flex;
  gap: 4px;
  background: #F0F2F5;
  border-radius: 9999px;
  padding: 4px;
  margin-bottom: 16px;
}

.trend-tab {
  flex: 1;
  padding: 8px 0;
  border-radius: 9999px;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: #7A828E;
  text-align: center;

  &.active {
    background: #fff;
    color: #383E48;
    box-shadow: 0 1px 3px rgba(56,62,72,0.06);
  }

  &:active {
    transform: scale(0.96);
  }
}

.chart-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(56,62,72,0.06);
  margin-bottom: 12px;
}

.chart-card-title {
  font-size: 14px;
  font-weight: 600;
  color: #383E48;
  margin-bottom: 8px;
}

.chart-canvas {
  width: 100%;
  height: 180px;
}

.chart-summary {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.chart-stat {
  flex: 1;
  text-align: center;
  padding: 10px;
  background: #F8F9FB;
  border-radius: 10px;

  .stat-val {
    font-size: 22px;
    font-weight: 700;
    color: #383E48;
    display: block;
  }

  .stat-label {
    font-size: 11px;
    color: #7A828E;
    margin-top: 2px;
    display: block;
  }
}
</style>