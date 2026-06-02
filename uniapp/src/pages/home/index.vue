<template>
  <view class="page-home">
    <!-- Loading -->
    <view v-if="!userStore.initialized || loadingStatus" class="loading-mask">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- Welcome Row -->
    <view class="welcome-row" v-if="userStore.initialized">
      <view class="avatar-circle">👶</view>
      <view class="welcome-text">
        <text class="greeting">{{ recordStore.greeting }}，{{ userStore.user?.childName ? userStore.user.childName + '妈妈' : '宝宝家长' }}</text>
        <text class="name">今天护理做好了吗？</text>
      </view>
    </view>

    <!-- Status Grid -->
    <view class="status-grid">
      <StatusCard
        icon="🧴"
        label="今日润肤"
        :status="moisturizingStatus"
        @click="onMoisturize"
      >
        <template #value>
          <text>{{ statusMoisturizing.current }}</text>
          <text style="font-size:14px">/{{ statusMoisturizing.target }}</text>
          <text style="font-size:13px;font-weight:500;color:#7A828E"> 次</text>
        </template>
      </StatusCard>

      <StatusCard
        icon="🩺"
        label="瘙痒评分"
        :value="statusItchText"
        :status="itchCardStatus"
        @click="switchToRecord"
      />

      <StatusCard
        icon="💊"
        label="今日用药"
        status="default"
        @click="switchToRecord"
      >
        <template #value>
          <text style="font-size:15px;color:#9AA0A6">暂未支持</text>
        </template>
      </StatusCard>

      <StatusCard
        icon="📸"
        label="今日拍照"
        :status="photoCardStatus"
        @click="switchToRecord"
      >
        <template #value>
          <text style="font-size:15px;color:#9AA0A6">{{ recordStore.todayStatus?.hasPhoto ? '已记录' : '未记录' }}</text>
        </template>
      </StatusCard>
    </view>

    <!-- Environment Card -->
    <view class="env-card">
      <text class="env-icon">🌤️</text>
      <view class="env-info">
        <text class="env-temp">今日护理</text>
        <text class="env-humi">{{ statusMoisturizing.done ? '润肤已完成 ✓' : '润肤尚未完成' }}</text>
      </view>
      <text class="env-tip" :class="{ done: statusMoisturizing.done }">
        {{ statusMoisturizing.done ? '已完成' : '待完成' }}
      </text>
    </view>

    <!-- Trigger Insight -->
    <view class="trigger-insight" v-if="latestRecord" @click="switchToTrends">
      <view class="ti-icon">🔍</view>
      <view class="ti-info">
        <text class="ti-title">最近一次记录</text>
        <text class="ti-desc">瘙痒 {{ latestRecord.itchScore }} 分 · {{ latestRecord.areas?.join('、') || '未标记部位' }}</text>
      </view>
    </view>

    <!-- Quick Actions -->
    <view class="quick-row">
      <button class="quick-btn primary" @click="switchToRecord">📸 拍照记录</button>
      <button class="quick-btn secondary" @click="onMoisturize">🧴 润肤打卡</button>
    </view>

    <!-- Recent Photos -->
    <view class="section-label" v-if="recentPhotos.length > 0">最近记录</view>
    <scroll-view scroll-x class="photo-history" :show-scrollbar="false" v-if="recentPhotos.length > 0">
      <view
        v-for="(rec, i) in recentPhotos"
        :key="i"
        class="photo-thumb"
        @click="switchToTrends"
      >
        <text>📸</text>
        <text style="font-size:11px">{{ rec.areas[0] || '未标记' }}</text>
        <text class="date-sm">{{ rec.dateStr }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { useRecordStore } from '@/stores/record.js'
import StatusCard from '@/components/StatusCard.vue'

const userStore = useUserStore()
const recordStore = useRecordStore()

const loadingStatus = ref(true)

onMounted(async () => {
  // 等待登录完成
  if (!userStore.initialized) {
    await userStore.doLogin()
  }
  // 加载今日状态和最近照片
  await Promise.all([
    recordStore.loadTodayStatus(),
    recordStore.loadRecentPhotos()
  ])
  loadingStatus.value = false
})

// 润肤状态
const statusMoisturizing = computed(() => {
  const s = recordStore.todayStatus?.moisturizing
  return s || { current: 0, target: 2, done: false }
})

const moisturizingStatus = computed(() => {
  if (statusMoisturizing.value.done) return 'done'
  if (statusMoisturizing.value.current > 0) return 'todo'
  return 'todo'
})

// 瘙痒状态
const statusItchText = computed(() => {
  const score = recordStore.todayStatus?.itchScore
  if (score !== null && score !== undefined) return score + ' 分'
  return '未记录'
})

const itchCardStatus = computed(() => {
  return recordStore.todayStatus?.itchScore !== null ? 'done' : 'todo'
})

// 拍照状态
const photoCardStatus = computed(() => {
  return recordStore.todayStatus?.hasPhoto ? 'done' : 'default'
})

// 最近照片
const recentPhotos = computed(() => recordStore.recentPhotos)

// 最近一条记录
const latestRecord = computed(() => recordStore.todayStatus?.todayRecord || null)

// 润肤打卡
const onMoisturize = async () => {
  if (statusMoisturizing.value.done) {
    uni.showToast({ title: '今日润肤已完成', icon: 'none' })
    return
  }
  const res = await recordStore.doMoisturize()
  if (res.code === 0) {
    uni.showToast({ title: '润肤打卡成功 🧴', icon: 'success' })
  } else {
    uni.showToast({ title: '打卡失败，请重试', icon: 'none' })
  }
}

const switchToRecord = () => {
  uni.switchTab({ url: '/pages/record/index' })
}

const switchToTrends = () => {
  uni.switchTab({ url: '/pages/trends/index' })
}
</script>

<style lang="scss" scoped>
.page-home {
  padding: 0 18px;
  padding-top: 6px;
}

.loading-mask {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.loading-text {
  font-size: 14px;
  color: #9AA0A6;
}

.welcome-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.avatar-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #EBF2FA, #E8D5F0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.welcome-text {
  flex: 1;

  .greeting {
    font-size: 13px;
    color: #7A828E;
    display: block;
  }

  .name {
    font-size: 17px;
    font-weight: 700;
    color: #383E48;
  }
}

.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
}

.env-card {
  background: #fff;
  border-radius: 14px;
  padding: 14px 16px;
  box-shadow: 0 1px 3px rgba(56,62,72,0.06);
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.env-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.env-info {
  flex: 1;

  .env-temp {
    font-size: 22px;
    font-weight: 700;
    color: #383E48;
    display: block;
  }

  .env-humi {
    font-size: 12px;
    color: #7A828E;
    margin-top: 2px;
    display: block;
  }
}

.env-tip {
  font-size: 12px;
  color: #D9534F;
  background: #FCEEED;
  padding: 5px 12px;
  border-radius: 9999px;
  font-weight: 500;

  &.done {
    color: #52B788;
    background: #EDF7F1;
  }
}

.trigger-insight {
  background: #fff;
  border-radius: 14px;
  padding: 14px 16px;
  box-shadow: 0 1px 3px rgba(56,62,72,0.06);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;

  &:active {
    transform: scale(0.985);
  }
}

.ti-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #FBF5E8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.ti-info {
  flex: 1;

  .ti-title {
    font-size: 14px;
    font-weight: 600;
    color: #383E48;
    display: block;
  }

  .ti-desc {
    font-size: 11px;
    color: #9AA0A6;
    margin-top: 3px;
    display: block;
  }
}

.quick-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.quick-btn {
  flex: 1;
  height: 48px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &.primary {
    background: #4A90D9;
    color: #fff;

    &:active {
      background: #3A7BC9;
      transform: scale(0.96);
    }
  }

  &.secondary {
    background: #fff;
    color: #4A90D9;
    border: 1.5px solid #4A90D9;

    &:active {
      background: #EBF2FA;
      transform: scale(0.96);
    }
  }
}

.section-label {
  font-size: 12px;
  font-weight: 700;
  color: #9AA0A6;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 16px 0 10px 2px;
}

.photo-history {
  display: flex;
  gap: 8px;
  padding-bottom: 24px;
  white-space: nowrap;
}

.photo-thumb {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  background: #EBF2FA;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #7A828E;
  gap: 4px;

  &:active {
    transform: scale(0.93);
  }

  .date-sm {
    font-size: 9px;
    color: #9AA0A6;
  }
}
</style>
