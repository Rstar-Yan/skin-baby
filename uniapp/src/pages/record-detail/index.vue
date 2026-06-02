<template>
  <view class="page-detail">
    <view v-if="loading" class="detail-loading">加载中...</view>

    <template v-if="record && !loading">
      <!-- 基本信息 -->
      <view class="detail-card">
        <view class="detail-row">
          <text class="detail-label">记录时间</text>
          <text class="detail-value">{{ formatDate(record.createdAt) }}</text>
        </view>
        <view class="detail-row">
          <text class="detail-label">瘙痒评分</text>
          <text class="detail-value score" :class="scoreClass(record.itchScore)">{{ record.itchScore }} 分</text>
        </view>
      </view>

      <!-- 受累部位 -->
      <view class="detail-card" v-if="record.areas && record.areas.length > 0">
        <text class="detail-card-title">受累部位</text>
        <view class="tag-group">
          <text class="tag tag-area" v-for="a in record.areas" :key="a">{{ a }}</text>
        </view>
      </view>

      <!-- 诱因 -->
      <view class="detail-card" v-if="hasTriggers">
        <text class="detail-card-title">疑似诱因</text>
        <view class="tag-group">
          <text class="tag tag-trigger" v-for="t in parsedTriggers" :key="t.key">{{ t.name }}</text>
        </view>
        <view v-if="record.customTrigger" class="detail-row" style="margin-top:8px">
          <text class="detail-label">自定义</text>
          <text class="detail-value">{{ record.customTrigger }}</text>
        </view>
      </view>

      <!-- 照片 -->
      <view class="detail-card" v-if="record.photoUrls && record.photoUrls.length > 0">
        <text class="detail-card-title">照片</text>
        <image
          v-for="(url, i) in record.photoUrls"
          :key="i"
          :src="url"
          class="detail-photo"
          mode="aspectFill"
          @click="previewPhoto(url)"
        />
      </view>
    </template>

    <view v-if="!record && !loading" class="detail-empty">
      <text>未找到记录</text>
    </view>
  </view>
</template>

<script>
// onLoad 接收参数
</script>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { recordsApi } from '@/utils/cloud.js'
import { onLoad } from '@dcloudio/uni-app'

const record = ref(null)
const loading = ref(true)
let recordId = ''

onLoad((query) => {
  recordId = query.id || ''
})

onMounted(async () => {
  if (!recordId) {
    loading.value = false
    return
  }
  try {
    const res = await recordsApi.getById(recordId)
    if (res.code === 0) {
      record.value = res.data
    }
  } catch (err) {
    console.error('加载记录失败:', err)
  } finally {
    loading.value = false
  }
})

const hasTriggers = computed(() => {
  if (!record.value) return false
  return (record.value.triggers && record.value.triggers.length > 0) || record.value.customTrigger
})

const parsedTriggers = computed(() => {
  if (!record.value?.triggers) return []
  return record.value.triggers.map((t, i) => {
    const parts = t.split(':')
    return { key: i, name: parts[1] || parts[0] }
  })
})

const formatDate = (ts) => {
  const d = new Date(ts)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const scoreClass = (score) => {
  if (score <= 3) return 'score-low'
  if (score <= 6) return 'score-mid'
  return 'score-high'
}

const previewPhoto = (url) => {
  uni.previewImage({ urls: [url] })
}
</script>

<style lang="scss" scoped>
.page-detail {
  padding: 16px 18px;
  padding-bottom: 24px;
}

.detail-loading, .detail-empty {
  text-align: center;
  padding: 60px 0;
  color: #9AA0A6;
  font-size: 14px;
}

.detail-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(56,62,72,0.06);
  margin-bottom: 12px;
}

.detail-card-title {
  font-size: 13px;
  font-weight: 600;
  color: #7A828E;
  margin-bottom: 10px;
  display: block;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;

  & + & {
    border-top: 1px solid #F0F2F5;
  }
}

.detail-label {
  font-size: 13px;
  color: #7A828E;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #383E48;

  &.score-low { color: #52B788; }
  &.score-mid { color: #D4A843; }
  &.score-high { color: #D9534F; }
}

.tag-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 500;

  &.tag-area {
    background: #EBF2FA;
    color: #4A90D9;
  }

  &.tag-trigger {
    background: #FBF5E8;
    color: #D4A843;
  }
}

.detail-photo {
  width: 100%;
  height: 200px;
  border-radius: 10px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
