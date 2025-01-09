<template>
  <div class="settings-page">
    <el-form :model="settings" label-width="120px">
      <!-- 番茄钟设置 -->
      <h3>番茄钟设置</h3>
      <el-form-item label="工作时长">
        <el-input-number v-model="settings.workDuration" :min="1" :max="60" />
      </el-form-item>
      <el-form-item label="短休息时长">
        <el-input-number v-model="settings.shortBreakDuration" :min="1" :max="30" />
      </el-form-item>
      <el-form-item label="长休息时长">
        <el-input-number v-model="settings.longBreakDuration" :min="5" :max="60" />
      </el-form-item>
      <el-form-item label="长休息间隔">
        <el-input-number v-model="settings.longBreakInterval" :min="2" :max="8" />
      </el-form-item>

      <!-- 声音设置 -->
      <h3>声音设置</h3>
      <el-form-item label="提醒铃声">
        <el-select v-model="settings.sound">
          <el-option
            v-for="sound in soundOptions"
            :key="sound.value"
            :label="sound.label"
            :value="sound.value"
          />
        </el-select>
        <el-button @click="playSound" size="small">试听</el-button>
      </el-form-item>
      <el-form-item label="背景音效">
        <el-select v-model="settings.backgroundSound">
          <el-option
            v-for="sound in backgroundSoundOptions"
            :key="sound.value"
            :label="sound.label"
            :value="sound.value"
          />
        </el-select>
        <el-slider v-model="settings.backgroundVolume" :max="100" :min="0" />
      </el-form-item>

      <!-- 通知设置 -->
      <h3>通知设置</h3>
      <el-form-item label="桌面通知">
        <el-switch v-model="settings.enableNotification" />
      </el-form-item>
      <el-form-item label="任务到期提醒">
        <el-switch v-model="settings.taskDueNotification" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { pomodoroStorage } from '@/utils/pomodoroStorage';
import { notification } from '@/utils/notification';

const settings = ref(pomodoroStorage.getSettings());

const soundOptions = [
  { label: '默认铃声', value: 'default' },
  { label: '温和提示音', value: 'gentle' },
  { label: '激励音效', value: 'motivational' }
];

const backgroundSoundOptions = [
  { label: '无', value: 'none' },
  { label: '白噪音', value: 'white-noise' },
  { label: '雨声', value: 'rain' },
  { label: '咖啡厅', value: 'cafe' }
];

// 保存设置
const saveSettings = () => {
  pomodoroStorage.saveSettings(settings.value);
};

// 试听音效
const playSound = () => {
  const audio = new Audio(`/sounds/${settings.value.sound}.mp3`);
  audio.play();
};

// 请求通知权限
const requestNotificationPermission = async () => {
  if (settings.value.enableNotification) {
    const permission = await notification.requestPermission();
    if (permission !== 'granted') {
      settings.value.enableNotification = false;
    }
  }
};

// 监听设置变化
watch(settings, () => {
  saveSettings();
}, { deep: true });

onMounted(() => {
  requestNotificationPermission();
});
</script>

<style lang="scss" scoped>
.settings-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;

  h3 {
    margin: 20px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
}
</style> 