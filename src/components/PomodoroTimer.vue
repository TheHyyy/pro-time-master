<template>
  <div :class="['pomodoro-timer', { 'fullscreen': isFullscreen }]">
    <div class="timer-display">
      <div class="time">{{ formatTime(timeLeft) }}</div>
      <div class="status">{{ currentStatus }}</div>
      <div class="task-info" v-if="task">
        <el-tag>当前任务: {{ task.title }}</el-tag>
      </div>
      <div class="progress">
        <el-progress
          :percentage="progressPercentage"
          :stroke-width="8"
          :color="progressColor"
          :show-text="false"
        />
      </div>
    </div>

    <div class="timer-controls">
      <el-button
        type="primary"
        :icon="isRunning ? VideoPause : VideoPlay"
        @click="toggleTimer"
        :disabled="task?.completed"
        circle
      />

      <el-button
        type="danger"
        :icon="Refresh"
        @click="resetTimer"
        :disabled="isRunning || task?.completed"
        circle
      />

      <el-button
        type="success"
        :icon="isFullscreen ? Minus : FullScreen"
        @click="toggleFullscreen"
        circle
      />
    </div>

    <el-drawer
      v-model="showSettings"
      title="番茄钟设置"
      direction="rtl"
      size="300px"
    >
      <el-form :model="settings" label-width="120px">
        <el-form-item label="工作时长(分钟)">
          <el-input-number v-model="settings.workTime" :min="1" :max="60" />
        </el-form-item>
        <el-form-item label="短休息时长(分钟)">
          <el-input-number v-model="settings.shortBreakTime" :min="1" :max="30" />
        </el-form-item>
        <el-form-item label="长休息时长(分钟)">
          <el-input-number v-model="settings.longBreakTime" :min="1" :max="60" />
        </el-form-item>
        <el-form-item label="长休息间隔">
          <el-input-number v-model="settings.longBreakInterval" :min="1" :max="10" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveSettings">保存设置</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { VideoPlay, VideoPause, Refresh, FullScreen, Minus, Setting } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { pomodoroStorage } from '@/utils/pomodoroStorage';
import { updateTodoPomodoros } from '@/api/todo';

const props = defineProps({
  task: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(["pomodoro-complete"]);

// 状态
const isFullscreen = ref(false);
const isRunning = ref(false);
const timeLeft = ref(25 * 60); // 默认25分钟
const currentMode = ref('work'); // work, shortBreak, longBreak
const completedPomodoros = ref(0);
const showSettings = ref(false);

// 设置
const settings = ref(pomodoroStorage.getSettings());

// 保存设置
const saveSettings = () => {
  pomodoroStorage.saveSettings(settings.value);
  showSettings.value = false;
  ElMessage.success('设置已保存');
  resetTimer();
};

// 保存当前会话状态
const saveCurrentSession = () => {
  if (isRunning.value) {
    pomodoroStorage.saveCurrentSession({
      timeLeft: timeLeft.value,
      currentMode: currentMode.value,
      completedPomodoros: completedPomodoros.value,
      taskId: props.task?.id
    });
  } else {
    pomodoroStorage.clearCurrentSession();
  }
};

// 恢复上次会话
const restoreLastSession = () => {
  const session = pomodoroStorage.getCurrentSession();
  if (session && session.taskId === props.task?.id) {
    timeLeft.value = session.timeLeft;
    currentMode.value = session.currentMode;
    completedPomodoros.value = session.completedPomodoros;
    // 可以选择是否自动继续计时
    // isRunning.value = true;
  }
};

// 在组件挂载时恢复会话
onMounted(() => {
  restoreLastSession();
});

// 定期保存会话状态
let saveInterval;
onMounted(() => {
  saveInterval = setInterval(saveCurrentSession, 1000);
});

onUnmounted(() => {
  clearInterval(saveInterval);
  saveCurrentSession();
});

// 计算属性
const currentStatus = computed(() => {
  if (!props.task) return "准备开始";
  if (props.task.completed) return "任务已完成";
  if (timeLeft.value === 0) return "时间到！";
  return isRunning.value ? 
    currentMode.value === 'work' ? "专注中..." : "休息中..." 
    : "准备开始";
});

const progressPercentage = computed(() => {
  const totalTime = currentMode.value === 'work' 
    ? settings.value.workTime * 60
    : currentMode.value === 'shortBreak' 
      ? settings.value.shortBreakTime * 60
      : settings.value.longBreakTime * 60;
  return ((totalTime - timeLeft.value) / totalTime) * 100;
});

const progressColor = computed(() => {
  if (timeLeft.value === 0) return "#67C23A";
  return currentMode.value === 'work' ? "#409EFF" : "#67C23A";
});

// 计时器逻辑
let timerInterval = null;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function toggleTimer() {
  if (props.task?.completed) {
    ElMessage.warning("任务已完成，无法开始计时");
    return;
  }

  if (isRunning.value) {
    clearInterval(timerInterval);
  } else {
    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        clearInterval(timerInterval);
        isRunning.value = false;
        handlePomodoroComplete();
      }
    }, 1000);
  }
  isRunning.value = !isRunning.value;
}

function resetTimer() {
  if (isRunning.value) return;
  clearInterval(timerInterval);
  timeLeft.value = settings.value.workTime * 60;
  isRunning.value = false;
  currentMode.value = 'work';
}

async function handlePomodoroComplete() {
  // 播放提示音
  const audio = new Audio("/notification.mp3");
  audio.play();

  if (currentMode.value === 'work') {
    completedPomodoros.value++;
    
    // 更新任务的番茄钟完成数
    if (props.task) {
      try {
        await updateTodoPomodoros(props.task.id);
        emit("pomodoro-complete");
      } catch (error) {
        console.error('Failed to update pomodoros:', error);
      }
    }

    // 判断是否需要长休息
    if (completedPomodoros.value % settings.value.longBreakInterval === 0) {
      currentMode.value = 'longBreak';
      timeLeft.value = settings.value.longBreakTime * 60;
    } else {
      currentMode.value = 'shortBreak';
      timeLeft.value = settings.value.shortBreakTime * 60;
    }
  } else {
    // 休息结束，开始新的工作时段
    currentMode.value = 'work';
    timeLeft.value = settings.value.workTime * 60;
  }

  // 自动开始下一个时段
  if ((currentMode.value === 'work' && settings.value.autoStartPomodoros) ||
      (currentMode.value !== 'work' && settings.value.autoStartBreaks)) {
    toggleTimer();
  }

  ElMessage.success({
    message: currentMode.value === 'work' 
      ? "休息结束，开始新的工作时段！" 
      : "工作时段完成，休息一下吧！",
    duration: 3000,
  });
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
}

// 组件卸载时清理定时器
onUnmounted(() => {
  clearInterval(timerInterval);
});

// 监听任务变化
watch(() => props.task, (newTask) => {
  if (newTask) {
    resetTimer();
  }
});
</script>

<style lang="scss" scoped>
.pomodoro-timer {
  text-align: center;
  padding: 20px;
  transition: all 0.3s ease;

  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .time {
      font-size: 120px !important;
      color: #fff !important;
    }

    .status {
      font-size: 24px !important;
      color: #fff !important;
    }

    .progress {
      width: 400px;
      margin: 40px auto;
    }
  }

  .timer-display {
    margin-bottom: 40px;

    .time {
      font-size: 48px;
      font-weight: bold;
      color: #409eff;
    }

    .status {
      font-size: 16px;
      color: #666;
      margin: 16px 0;
    }

    .task-info {
      margin: 16px 0;
    }

    .progress {
      margin-top: 16px;
      width: 200px;
      margin: 0 auto;
    }
  }

  .timer-controls {
    display: flex;
    justify-content: center;
    gap: 24px;

    .el-button {
      width: 48px;
      height: 48px;
    }
  }
}
</style>
