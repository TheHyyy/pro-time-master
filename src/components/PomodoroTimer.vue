<template>
  <div class="pomodoro_timer" :class="{ fullscreen: isFullscreen }">
    <div v-show="isFullscreen">
      <!-- 左上角的折叠按钮 -->
      <div class="close-button" @click="toggleFullscreen">
        <el-icon><ArrowDown /></el-icon>
      </div>
      <div class="timer-content">
        <!-- 顶部任务名称 -->
        <div class="task-name">
          {{ task?.title || "请选择一个任务..." }}
        </div>
        <!-- 计时器圆环 -->
        <div class="timer-circle">
          <div class="time-display">{{ formatTime(timeLeft) }}</div>
          <div class="timer-controls">
            <el-button type="primary" round size="large" @click="toggleTimer">
              {{ isRunning ? "暂停" : "开始专注" }}
            </el-button>
          </div>
        </div>

        <!-- 底部控制栏 -->
        <div class="bottom-controls">
          <div class="control-item" @click="toggleWhiteNoise">
            <el-icon><Notification /></el-icon>
            <span>{{ isPlayingWhiteNoise ? '关闭白噪音' : '开启白噪音' }}</span>
          </div>
          <div class="volume-slider" v-if="isPlayingWhiteNoise">
            <el-slider
              v-model="whiteNoiseVolume"
              :min="0"
              :max="100"
              :step="1"
              @input="adjustWhiteNoiseVolume"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-show="!isFullscreen" @click="toggleFullscreen">
      <div class="time-display">{{ formatTime(timeLeft) }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { Timer, ArrowDown, FullScreen, Notification } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { pomodoroStorage } from "@/utils/pomodoroStorage";
import { updateTodoPomodoros } from "@/api/todo";

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
const currentMode = ref("work"); // work, shortBreak, longBreak
const completedPomodoros = ref(0);
const settings = ref(pomodoroStorage.getSettings());

// 白噪音相关状态
const isPlayingWhiteNoise = ref(false);
const whiteNoiseVolume = ref(50);
const whiteNoiseAudio = ref(null);

// 保存当前会话状态
const saveCurrentSession = () => {
  if (isRunning.value) {
    pomodoroStorage.saveCurrentSession({
      timeLeft: timeLeft.value,
      currentMode: currentMode.value,
      completedPomodoros: completedPomodoros.value,
      taskId: props.task?.id,
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
  }
};

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
  currentMode.value = "work";
}

async function handlePomodoroComplete() {
  const audio = new Audio("/notification.mp3");
  audio.play();

  if (currentMode.value === "work") {
    completedPomodoros.value++;

    if (props.task) {
      try {
        await updateTodoPomodoros(props.task.id);
        emit("pomodoro-complete");
      } catch (error) {
        console.error("Failed to update pomodoros:", error);
      }
    }

    if (completedPomodoros.value % settings.value.longBreakInterval === 0) {
      currentMode.value = "longBreak";
      timeLeft.value = settings.value.longBreakTime * 60;
    } else {
      currentMode.value = "shortBreak";
      timeLeft.value = settings.value.shortBreakTime * 60;
    }
  } else {
    currentMode.value = "work";
    timeLeft.value = settings.value.workTime * 60;
  }

  if (
    (currentMode.value === "work" && settings.value.autoStartPomodoros) ||
    (currentMode.value !== "work" && settings.value.autoStartBreaks)
  ) {
    toggleTimer();
  }

  ElMessage.success({
    message:
      currentMode.value === "work"
        ? "休息结束，开始新的工作时段！"
        : "工作时段完成，休息一下吧！",
    duration: 3000,
  });
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
}

// 生命周期钩子
onMounted(() => {
  restoreLastSession();
  const saveInterval = setInterval(saveCurrentSession, 1000);
  return () => clearInterval(saveInterval);
});

onUnmounted(() => {
  clearInterval(timerInterval);
  saveCurrentSession();
});

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      resetTimer();
    }
  }
);

// 白噪音控制函数
function toggleWhiteNoise() {
  if (!whiteNoiseAudio.value) {
    whiteNoiseAudio.value = new Audio('/white-noise.mp3');
    whiteNoiseAudio.value.loop = true;
  }

  if (isPlayingWhiteNoise.value) {
    whiteNoiseAudio.value.pause();
  } else {
    whiteNoiseAudio.value.volume = whiteNoiseVolume.value / 100;
    whiteNoiseAudio.value.play();
  }
  
  isPlayingWhiteNoise.value = !isPlayingWhiteNoise.value;
}

function adjustWhiteNoiseVolume(value) {
  if (whiteNoiseAudio.value) {
    whiteNoiseAudio.value.volume = value / 100;
  }
}

// 组件卸载时停止白噪音
onUnmounted(() => {
  if (whiteNoiseAudio.value) {
    whiteNoiseAudio.value.pause();
    whiteNoiseAudio.value = null;
  }
});
</script>

<style lang="scss" scoped>
.close-button {
  position: absolute;
  top: 32px;
  left: 32px;
  z-index: 2001;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  .el-icon {
    font-size: 20px;
  }
}
.pomodoro_timer {
  position: fixed;
  bottom: 24px;
  left: 50%;
  width: 80px;
  height: 80px;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #363636 100%);
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 2000;
  opacity: 1;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  color: #fff;
  cursor: pointer;

  &:hover {
    transform: translateX(-50%) scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }

  &.fullscreen {
    width: 100%;
    height: 100%;
    bottom: 0;
    border-radius: 0;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    cursor: default;

    .timer-content {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // 非全屏时的样式
  &:not(.fullscreen) {
    .time-display {
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
  }
}

.timer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.task-name {
  font-size: 20px;
  font-weight: 300;
  margin-bottom: 48px;
  opacity: 0.9;
  letter-spacing: 0.5px;
}

.timer-circle {
  position: relative;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 48px;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.03) 0%, transparent 70%);

  &::before {
    content: "";
    position: absolute;
    width: 380px;
    height: 380px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.05);
    pointer-events: none;
  }

  .time-display {
    font-size: 88px;
    font-weight: 200;
    margin-bottom: 24px;
    letter-spacing: 2px;
  }

  .timer-controls {
    :deep(.el-button) {
      padding: 12px 36px;
      font-size: 16px;
      background: rgba(255, 255, 255, 0.06);
      border: none;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

.bottom-controls {
  display: flex;
  gap: 60px;
  margin-top: 40px;

  .control-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.3s;

    &:hover {
      opacity: 1;
    }

    .el-icon {
      font-size: 24px;
    }

    span {
      font-size: 12px;
    }
  }
}

.close-button {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 2001;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.8);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  .el-icon {
    font-size: 20px;
  }
}
</style>
