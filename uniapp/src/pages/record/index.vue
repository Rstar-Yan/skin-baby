<template>
  <view class="page-record">
    <!-- Photo Zone -->
    <view class="photo-zone" @click="onTakePhoto">
      <image v-if="previewUrl" :src="previewUrl" class="photo-preview" mode="aspectFill"></image>
      <template v-else>
        <text class="cam-icon">📷</text>
        <text class="cam-hint">点击拍摄皮损部位</text>
        <text class="cam-sub">对准宝宝患处，光线充足时拍摄效果最佳</text>
      </template>
    </view>

    <!-- Body Map -->
    <BodyMap :modelValue="store.selectedAreas" @update:modelValue="store.selectedAreas = $event" />

    <!-- Itch Slider -->
    <ItchSlider :modelValue="store.itchScore" @update:modelValue="store.itchScore = $event" />

    <!-- Trigger Tags -->
    <TriggerTags
      :modelValue="store.selectedTriggers"
      @update:modelValue="store.selectedTriggers = $event"
      :customValue="store.customTrigger"
      @update:customValue="store.customTrigger = $event"
    />

    <!-- Save Button -->
    <button class="save-btn" :disabled="saving" @click="onSave">
      {{ saving ? '保存中...' : '保存记录' }}
    </button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useRecordStore } from '@/stores/record.js'
import BodyMap from '@/components/BodyMap.vue'
import ItchSlider from '@/components/ItchSlider.vue'
import TriggerTags from '@/components/TriggerTags.vue'

const store = useRecordStore()
const saving = ref(false)
const previewUrl = ref('')
const tempFilePaths = ref([])

// 拍照
const onTakePhoto = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['camera', 'album'],
    success: (res) => {
      previewUrl.value = res.tempFilePaths[0]
      tempFilePaths.value = res.tempFilePaths
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

  const result = await store.saveRecord(tempFilePaths.value)

  if (result.success) {
    uni.showToast({ title: '记录已保存', icon: 'success' })
    store.clearRecord()
    previewUrl.value = ''
    tempFilePaths.value = []

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
  padding-bottom: 40px;
  height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
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
  overflow: hidden;
  position: relative;

  &:active {
    border-color: #4A90D9;
    background: #EBF2FA;
    transform: scale(0.985);
  }
}

.photo-preview {
  width: 100%;
  height: 100%;
  border-radius: 12px;
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
