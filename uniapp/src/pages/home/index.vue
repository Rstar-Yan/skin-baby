<template>
  <view class="page-home">
    <!-- Welcome Row -->
    <view class="welcome-row">
      <view class="avatar-circle">👶</view>
      <view class="welcome-text">
        <text class="greeting">下午好，{{ userStore.childDisplayName }}{{ userStore.user?.childName ? '妈妈' : '家长' }}</text>
        <text class="name">今天护理做好了吗？</text>
      </view>
    </view>

    <!-- Status Grid: 2x2 -->
    <view class="status-grid">
      <StatusCard
        icon="🧴"
        label="今日润肤"
        :status="moisturizingStatus"
        @click="onMoisturize"
      >
        <template #value>
          <text>{{ todayStatus.moisturizing.current }}</text>
          <text style="font-size:14px">/{{ todayStatus.moisturizing.target }}</text>
          <text style="font-size:13px;font-weight:500;color:#7A828E"> 次</text>
        </template>
      </StatusCard>

      <StatusCard
        icon="🩺"
        label="瘙痒评分"
        :value="todayStatus.itchScore + ' 分'"
        status="todo"
        @click="switchToRecord"
      />

      <StatusCard
        icon="💊"
        label="今日用药"
        status="done"
        @click="switchToRecord"
      >
        <template #value>
          <text style="font-size:15px;color:#52B788">已完成</text>
        </template>
      </StatusCard>

      <StatusCard
        icon="📸"
        label="今日拍照"
        status="default"
        @click="switchToRecord"
      >
        <template #value>
          <text style="font-size:15px;color:#9AA0A6">未记录</text>
        </template>
      </StatusCard>
    </view>

    <!-- Environment Card -->
    <view class="env-card">
      <text class="env-icon">🌤️</text>
      <view class="env-info">
        <text class="env-temp">{{ todayStatus.environment.city }} {{ todayStatus.environment.temp }}°</text>
        <text class="env-humi">湿度 {{ todayStatus.environment.humidity }}% · 较干燥</text>
      </view>
      <text class="env-tip">⚠️ 加强润肤</text>
    </view>

    <!-- Trigger Insight -->
    <view class="trigger-insight" @click="switchToRecord">
      <view class="ti-icon">🔍</view>
      <view class="ti-info">
        <text class="ti-title">本月可疑诱因</text>
        <text class="ti-desc">{{ triggerInsight.description }}</text>
      </view>
      <text class="ti-badge">⚠️ 高关联</text>
    </view>

    <!-- Quick Actions -->
    <view class="quick-row">
      <button class="quick-btn primary" @click="switchToRecord">📸 拍照记录</button>
      <button class="quick-btn secondary" @click="onMoisturize">🧴 润肤打卡</button>
    </view>

    <!-- Recent Records -->
    <view class="section-label">最近记录</view>
    <scroll-view scroll-x class="photo-history" :show-scrollbar="false">
      <view
        v-for="(rec, i) in recentRecords"
        :key="i"
        class="photo-thumb"
        @click="switchToTrends"
      >
        <text>{{ rec.icon }}</text>
        <text style="font-size:11px">{{ rec.area }}</text>
        <text class="date-sm">{{ rec.date }}</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useUserStore } from '@/stores/user.js'
import { todayStatus as mockTodayStatus, recentRecords as mockRecentRecords, triggerInsight as mockTriggerInsight } from '@/utils/mock-data.js'
import StatusCard from '@/components/StatusCard.vue'

const userStore = useUserStore()
const userInfo = computed(() => userStore.user ? { name: userStore.childDisplayName } : { name: '小贝壳' })
const todayStatus = reactive({ ...mockTodayStatus })
const recentRecords = ref([...mockRecentRecords])
const triggerInsightData = ref({ ...mockTriggerInsight })

const moisturizingStatus = computed(() => {
  if (todayStatus.moisturizing.done) return 'done'
  if (todayStatus.moisturizing.current >= todayStatus.moisturizing.target) return 'done'
  return 'todo'
})

const onMoisturize = () => {
  if (todayStatus.moisturizing.current >= todayStatus.moisturizing.target) {
    uni.showToast({ title: '今日润肤已完成', icon: 'none' })
    return
  }
  todayStatus.moisturizing.current++
  if (todayStatus.moisturizing.current >= todayStatus.moisturizing.target) {
    todayStatus.moisturizing.done = true
  }
  uni.showToast({ title: '润肤打卡成功', icon: 'success' })
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

.ti-badge {
  font-size: 11px;
  font-weight: 600;
  color: #D4A843;
  background: #FBF5E8;
  padding: 4px 10px;
  border-radius: 9999px;
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