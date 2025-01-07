<template>
  <div>
    <el-drawer
      :width="340"
      :model-value="visible"
      @open="handleOpen"
      @close="handleClose"
      unmountOnClose
    >
      <template #header>
        <h3>任务详情</h3>
      </template>
      
      <div class="drawer-content">
        <div class="detail-item">
          <span class="label">任务名称：</span>
          <span>{{ data.title }}</span>
        </div>
        
        <div class="detail-item">
          <span class="label">优先级：</span>
          <span :style="{ color: getPriorityColor(data.priority) }">
            {{ getPriorityLabel(data.priority) }}
          </span>
        </div>
        
        <div class="detail-item">
          <span class="label">预计番茄数：</span>
          <span>{{ data.estimatedPomodoro }} 个</span>
        </div>
        
        <div class="detail-item">
          <span class="label">已完成番茄数：</span>
          <span>{{ data.completedPomodoros || 0 }} 个</span>
        </div>
        
        <div class="detail-item">
          <span class="label">截止日期：</span>
          <span>{{ formatDate(data.dueDate) }}</span>
        </div>
        
        <div class="detail-item">
          <span class="label">完成状态：</span>
          <span>{{ data.completed ? '已完成' : '未完成' }}</span>
        </div>

        <div class="pomodoro-section">
          <h4>番茄钟计时</h4>
          <PomodoroTimer 
            :task="data"
            @pomodoro-complete="handlePomodoroComplete"
          />
        </div>
      </div>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="handleClose">关闭</el-button>
          <el-button @click="handleDelete" type="danger" plain>删除</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { URGENT_COLOR_MAP, URGENT_LABEL_MAP } from '@/constant/todo';
import { formatDate } from '@/utils/date';
import PomodoroTimer from '@/components/PomodoroTimer.vue';
import { updateTodo } from '@/api/todo';

const props = defineProps({
  visible: Boolean,
  data: Object,
});

const emit = defineEmits(["update-visible", "delete", "update"]);

const getPriorityColor = (priority) => URGENT_COLOR_MAP[priority] || '#409EFF';
const getPriorityLabel = (priority) => URGENT_LABEL_MAP[priority] || '未设置';

const handlePomodoroComplete = async () => {
  try {
    const updatedTodo = {
      ...props.data,
      completedPomodoros: (props.data.completedPomodoros || 0) + 1
    };
    
    await updateTodo(updatedTodo);
    emit('update', updatedTodo);
    
    ElMessage.success('完成一个番茄钟！');
  } catch (error) {
    ElMessage.error('更新失败');
  }
};

const handleOpen = () => {
  // 可以在这里加载额外数据
};

const handleClose = () => {
  emit("update-visible", false);
};

const handleDelete = () => {
  emit("delete", props.data);
  handleClose();
};
</script>

<style lang="scss" scoped>
.drawer-content {
  padding: 20px;
}

.detail-item {
  margin-bottom: 16px;
  
  .label {
    color: #666;
    margin-right: 8px;
  }
}

.pomodoro-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
  
  h4 {
    margin-bottom: 16px;
    color: #333;
  }
}

.drawer-footer {
  text-align: right;
}
</style>
