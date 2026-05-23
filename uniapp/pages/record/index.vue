<template>
  <view class="page-record">
    <!-- Photo Zone -->
    <view class="photo-zone" @click="onTakePhoto">
      <text class="cam-icon">📷</text>
      <text class="cam-hint">点击拍摄皮损部位</text>
      <text class="cam-sub">对准宝宝患处，光线充足时拍摄效果最佳</text>
    </view>

    <!-- Body Map -->
    <BodyMap v-model="selectedAreas" />

    <!-- Itch Slider -->
    <ItchSlider v-model="itchScore" />

    <!-- Save Button -->
    <button class="save-btn" @click="onSave">保存记录</button>

    <!-- Trigger Tags -->
    <TriggerTags
      v-model="selectedTriggers"
      v-model:customValue="customTrigger"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import BodyMap from '@/components/BodyMap.vue'
import ItchSlider from '@/components/ItchSlider.vue'
import TriggerTags from '@/components/TriggerTags.vue'

const selectedAreas = ref([])
const selectedTriggers = ref([])
const customTrigger = ref('')
const itchScore = ref(6)

const onTakePhoto = () => {
  uni.showToast({ title: '模拟拍照完成', icon: 'none' })
}

const onSave = () => {
  const count = selectedTriggers.value.length
  const msg = count > 0
    ? `已保存症状 + ${count}个诱因`
    : '记录已保存（未标记诱因）'

  uni.showToast({ title: msg, icon: 'none', duration: 1500 })

  setTimeout(() => {
    // Clear form
    selectedAreas.value = []
    selectedTriggers.value = []
    customTrigger.value = ''
    itchScore.value = 6
    // Navigate back to home
    uni.switchTab({ url: '/pages/home/index' })
  }, 1500)
}
</script>

<style lang="scss" scoped>
.page-record {
  padding: 0 18px;
  padding-bottom: 24px;
}

.photo-zone {
  width: 100%;
  height: 180px;
  background: #F5F6F8;
  border: 2px dashed #D5DAE0;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: all 0.25s ease;

  &:active {
    border-color: #4A90D9;
    background: #EBF2FA;
    transform: scale(0.985);
  }
}

.cam-icon {
  font-size: 44px;
  margin-bottom: 8px;
  opacity: 0.7;
}

.cam-hint {
  font-size: 14px;
  color: #7A828E;
  font-weight: 500;
}

.cam-sub {
  font-size: 11px;
  color: #9AA0A6;
  margin-top: 4px;
}

.save-btn {
  width: 100%;
  height: 50px;
  border-radius: 10px;
  background: #4A90D9;
  color: #fff;
  border: none;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 12px;

  &:active {
    background: #3A7BC9;
    transform: scale(0.97);
  }
}
</style>