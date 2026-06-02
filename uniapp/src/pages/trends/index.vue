<template>
  <view class="page-trends">
    <!-- Trend Tabs -->
    <view class="trend-tabs">
      <view
        class="trend-tab"
        :class="{ active: activeTab === 'week' }"
        @click="onSwitchTab('week')"
      >
        本周
      </view>
      <view
        class="trend-tab"
        :class="{ active: activeTab === 'records' }"
        @click="onSwitchTab('records')"
      >
        记录列表
      </view>
    </view>

    <!-- Loading -->
    <view v-if="loadingTrend" class="trend-loading">加载中...</view>

    <!-- Week Chart -->
    <view v-if="activeTab === 'week' && trendData" class="chart-card">
      <view class="chart-card-title">瘙痒评分趋势 · 本周</view>
      <canvas
        type="2d"
        id="trendChart"
        class="chart-canvas"
      ></canvas>
      <view class="chart-summary">
        <view class="chart-stat">
          <text class="stat-val" style="color:#D9534F">{{ trendData.highest }}</text>
          <text class="stat-label">最高评分</text>
        </view>
        <view class="chart-stat">
          <text class="stat-val">{{ trendData.average }}</text>
          <text class="stat-label">平均评分</text>
        </view>
        <view class="chart-stat">
          <text class="stat-val" style="color:#52B788">{{ trendData.lowest }}</text>
          <text class="stat-label">最低评分</text>
        </view>
      </view>
    </view>

    <!-- Records List -->
    <view v-if="activeTab === 'records'">
      <view v-for="rec in records" :key="rec._id" class="record-item" @click="goDetail(rec._id)">
        <view class="record-header">
          <text class="record-date">{{ formatDate(rec.createdAt) }}</text>
          <text class="record-score" :class="scoreClass(rec.itchScore)">{{ rec.itchScore }} 分</text>
        </view>
        <view class="record-body" v-if="rec.areas && rec.areas.length > 0">
          <text class="record-tag" v-for="a in rec.areas" :key="a">{{ a }}</text>
        </view>
        <view class="record-triggers" v-if="rec.triggers && rec.triggers.length > 0">
          <text class="trigger-tag-sm" v-for="t in rec.triggers" :key="t">{{ t.split(':')[1] || t }}</text>
        </view>
        <text class="record-arrow">›</text>
      </view>

      <view v-if="records.length === 0 && !loadingTrend" class="empty-state">
        <text>暂无记录，快去拍照记录吧 📸</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRecordStore } from '@/stores/record.js'

const recordStore = useRecordStore()
const activeTab = ref('week')
const trendData = ref(null)
const records = ref([])
const loadingTrend = ref(true)

onMounted(async () => {
  await Promise.all([
    recordStore.loadWeekTrend(),
    recordStore.fetchRecords()
  ])
  trendData.value = recordStore.weekTrend
  records.value = recordStore.records
  loadingTrend.value = false

  if (trendData.value) {
    setTimeout(() => drawChart(trendData.value.trend), 300)
  }
})

const onSwitchTab = async (tab) => {
  activeTab.value = tab
  if (tab === 'week' && trendData.value) {
    setTimeout(() => drawChart(trendData.value.trend), 200)
  }
}

// 画图
const drawChart = (dataPoints) => {
  if (!dataPoints || dataPoints.length === 0) return

  const query = uni.createSelectorQuery()
  query.select('#trendChart')
    .fields({ node: true, size: true })
    .exec((res) => {
      if (!res[0] || !res[0].node) {
        setTimeout(() => drawChart(dataPoints), 200)
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

      const padLeft = 40
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

      // Y labels
      ctx.fillStyle = '#9AA0A6'
      ctx.font = '10px -apple-system'
      ctx.textAlign = 'right'
      for (let i = 0; i <= 4; i++) {
        const val = Math.round(10 - i * 2.5)
        const y = padTop + (plotH / 4) * i
        ctx.fillText(String(val), padLeft - 6, y + 4)
      }

      // Filter days that have data
      const hasData = dataPoints.filter(p => p.count > 0)
      if (hasData.length === 0) return

      const stepX = plotW / Math.max(dataPoints.length - 1, 1)

      // Area fill (skip null)
      ctx.beginPath()
      let firstX = padLeft
      ctx.moveTo(firstX, padTop + plotH)

      dataPoints.forEach((pt, i) => {
        const x = padLeft + stepX * i
        if (pt.score !== null) {
          const y = padTop + plotH - (pt.score / maxScore) * plotH
          ctx.lineTo(x, y)
        }
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
        if (pt.score !== null) {
          const y = padTop + plotH - (pt.score / maxScore) * plotH
          if (i === 0 || dataPoints[i - 1].score === null) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Dots + X labels
      dataPoints.forEach((pt, i) => {
        const x = padLeft + stepX * i

        // X label
        ctx.fillStyle = '#9AA0A6'
        ctx.font = '9px -apple-system'
        ctx.textAlign = 'center'
        ctx.fillText(pt.label, x, padTop + plotH + 18)

        if (pt.score !== null) {
          const y = padTop + plotH - (pt.score / maxScore) * plotH
          ctx.beginPath()
          ctx.arc(x, y, 4.5, 0, Math.PI * 2)
          ctx.fillStyle = '#fff'
          ctx.fill()
          ctx.strokeStyle = '#4A90D9'
          ctx.lineWidth = 2.5
          ctx.stroke()

          // Score label
          ctx.fillStyle = '#383E48'
          ctx.font = 'bold 10px -apple-system'
          ctx.textAlign = 'center'
          ctx.fillText(String(pt.score), x, y - 10)
        }
      })
    })
}

const formatDate = (ts) => {
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const scoreClass = (score) => {
  if (!score && score !== 0) return ''
  if (score <= 3) return 'score-low'
  if (score <= 6) return 'score-mid'
  return 'score-high'
}

const goDetail = (id) => {
  uni.navigateTo({ url: '/pages/record-detail/index?id=' + id })
}
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

.trend-loading {
  text-align: center;
  padding: 40px 0;
  color: #9AA0A6;
  font-size: 13px;
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
  height: 200px;
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

// 记录列表
.record-item {
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(56,62,72,0.06);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: relative;

  &:active {
    transform: scale(0.98);
  }
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.record-date {
  font-size: 12px;
  color: #7A828E;
  font-weight: 500;
}

.record-score {
  font-size: 15px;
  font-weight: 700;

  &.score-low { color: #52B788; }
  &.score-mid { color: #D4A843; }
  &.score-high { color: #D9534F; }
}

.record-body {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.record-tag {
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 10px;
  background: #EBF2FA;
  color: #4A90D9;
  font-weight: 500;
}

.record-triggers {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.trigger-tag-sm {
  padding: 2px 6px;
  border-radius: 9999px;
  font-size: 9px;
  background: #FBF5E8;
  color: #D4A843;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  font-size: 14px;
  color: #9AA0A6;
}

.record-arrow {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 22px;
  color: #D5DAE0;
  font-weight: 300;
}
</style>
