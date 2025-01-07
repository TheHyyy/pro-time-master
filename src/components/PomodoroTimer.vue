<template>
  <div class="pomodoro-timer">
    <div class="timer-display">
      <div class="time">{{ formatTime(timeLeft) }}</div>
      <div class="status">{{ currentStatus }}</div>
      <div class="progress">
        <el-progress
          :percentage="progressPercentage"
          :stroke-width="8"
          :color="progressColor"
        />
      </div>
    </div>

    <div class="timer-controls">
      <el-button
        type="primary"
        :icon="isRunning ? VideoPause : VideoPlay"
        @click="toggleTimer"
        :disabled="task.completed"
      >
        {{ isRunning ? "暂停" : "开始" }}
      </el-button>

      <el-button
        type="danger"
        :icon="Refresh"
        @click="resetTimer"
        :disabled="isRunning || task.completed"
      >
        重置
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from "vue";
import { VideoPlay, VideoPause, Refresh } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["pomodoro-complete"]);

const POMODORO_TIME = 25 * 60; // 25分钟
const timeLeft = ref(POMODORO_TIME);
const isRunning = ref(false);
let timerInterval = null;

const currentStatus = computed(() => {
  if (props.task.completed) return "任务已完成";
  if (timeLeft.value === 0) return "时间到！";
  return isRunning.value ? "专注中..." : "准备开始";
});

const progressPercentage = computed(() => {
  return ((POMODORO_TIME - timeLeft.value) / POMODORO_TIME) * 100;
});

const progressColor = computed(() => {
  if (timeLeft.value === 0) return "#67C23A";
  return "#409EFF";
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function toggleTimer() {
  if (props.task.completed) {
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
  timeLeft.value = POMODORO_TIME;
  isRunning.value = false;
}

const handlePomodoroComplete = async () => {
  try {
    const response = await updateTodo({
      ...props.data,
      completedPomodoros: (props.data.completedPomodoros || 0) + 1
    });
    
    if (response.data) {
      emit('update', response.data);
      ElMessage.success('完成一个番茄钟！');
    }
  } catch (error) {
    ElMessage.error('更新失败');
  }
};

// 组件卸载时清理定时器
onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>

<style lang="scss" scoped>
.pomodoro-timer {
  text-align: center;
  padding: 20px;

  .timer-display {
    margin-bottom: 20px;

    .time {
      font-size: 48px;
      font-weight: bold;
      color: #409eff;
    }

    .status {
      font-size: 16px;
      color: #666;
      margin: 8px 0;
    }

    .progress {
      margin-top: 16px;
    }
  }

  .timer-controls {
    display: flex;
    justify-content: center;
    gap: 16px;
  }
}
</style>
