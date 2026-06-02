<template>
  <view class="page-record">
    <!-- Photo Zone -->
    <view class="photo-zone" @click="onTakePhoto">
      <text class="cam-icon">📷</text>
      <text class="cam-hint">{{ hasPhoto ? '已拍摄 ✓ 点击重拍' : '点击拍摄皮损部位' }}</text>
      <text class="cam-sub" v-if="!hasPhoto">对准宝宝患处，光线充足时拍摄效果最佳</text>
    </view>

    <!-- Body Map -->
    <BodyMap v-model="selectedAreas" />

    <!-- Itch Slider -->
    <ItchSlider v-model="itchScore" />

    <!-- Trigger Tags -->
    <TriggerTags
      v-model="selectedTriggers"
      v-model:customValue="customTrigger"
    />

    <!-- Save Button -->
    <button class="save-btn" :disabled="saving" @click="onSave">
      {{ saving ? '保存中...' : '保存记录' }}
    </button>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRecordStore } from '@/stores/record.js'
import BodyMap from '@/components/BodyMap.vue'
import ItchSlider from '@/components/ItchSlider.vue'
import TriggerTags from '@/components/TriggerTags.vue'

const store = useRecordStore()
const saving = ref(false)
const hasPhoto = ref(false)

// 从 store 获取当前表单值
const selectedAreas = computed({
  get: () => store.selectedAreas,
  set: (v) => store.selectedAreas = v
})

const selectedTriggers = computed({
  get: () => store.selectedTriggers,
  set: (v) => store.selectedTriggers = v
})

const customTrigger = computed({
  get: () => store.customTrigger,
  set: (v) => store.customTrigger = v
})

const itchScore = computed({
  get: () => store.itchScore,
  set: (v) => store.itchScore = v
})

// 拍照
const onTakePhoto = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera', 'album'],
    success: (res) => {
      // 先用云存储上传，后面再实现
      // 当前版本先标记已拍照
      hasPhoto.value = true
      uni.showToast({ title: '拍照成功', icon: 'success' })
    },
    fail: (err) => {
      if (err.errMsg !== 'chooseImage:fail cancel') {
        uni.showToast({ title: '拍照失败', icon: 'none' })
      }
    }
  })
}

// 保存
const onSave = async () => {
  if (saving.value) return
  saving.value = true

  const result = await store.saveRecord()

  if (result.success) {
    uni.showToast({ title: '记录已保存', icon: 'success' })
    store.clearRecord()
    hasPhoto.value = false

    setTimeout(() => {
      uni.switchTab({ url: '/pages/home/index' })
    }, 1000)
  } else {
    uni.showToast({ title: result.error || '保存失败', icon: 'none' })
    saving.value = false
  }
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

  &[disabled] {
    opacity: 0.6;
  }
}
</style>
