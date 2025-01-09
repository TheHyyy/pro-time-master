<template>
  <div class="todo-page">
    <!-- 顶部统计区域 -->
    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-value">{{ formatTime(totalFocusTime) }}</div>
        <div class="stat-label">预计时间</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">0</div>
        <div class="stat-label">待完成任务</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ formatTime(totalCompletedTime) }}</div>
        <div class="stat-label">已专注时间</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">0</div>
        <div class="stat-label">已完成任务</div>
      </div>
    </div>

    <!-- 任务输入区域 -->
    <div class="task-input">
      <el-input
        v-model="newTaskTitle"
        placeholder="在任务中添加一个任务，按「回车」键保存"
        @keyup.enter="addTodo"
      >
        <template #prefix>
          <el-icon><Plus /></el-icon>
        </template>
      </el-input>
      <div class="quick-actions">
        <el-tag
          v-for="tag in quickTags"
          :key="tag"
          size="small"
          @click="addQuickTask(tag)"
        >
          {{ tag }}
        </el-tag>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="todo-list" v-if="filteredTodos.length > 0">
      <div
        v-for="todo in filteredTodos"
        :key="todo.id"
        class="todo-item"
        :class="{ completed: todo.completed }"
      >
        <div class="todo-content">
          <el-checkbox v-model="todo.completed" @change="toggleTodo(todo)" />
          <span class="todo-title">{{ todo.title }}</span>
        </div>
        <div class="todo-actions">
          <span class="pomodoro-count" v-if="todo.pomodoroCount">
            {{ todo.pomodoroCount }} 个番茄钟
          </span>
          <el-button text type="primary" @click="startPomodoro(todo)">
            开始专注
          </el-button>
          <el-button text type="primary" @click="editTodo(todo)">
            编辑
          </el-button>
          <el-button text type="danger" @click="deleteTodo(todo)">
            删除
          </el-button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <el-empty description="暂无任务">
        <template #image>
          无任务
          <!-- <img src="@/assets/empty-tasks.png" alt="无任务" /> -->
        </template>
      </el-empty>
    </div>

    <!-- 番茄钟计时器 -->
    <pomodoro-timer
      ref="pomodoroTimer"
      :task="currentTask"
      @pomodoro-complete="handlePomodoroComplete"
    />

    <!-- 任务抽屉 -->
    <todo-drawer
      v-model:visible="drawerVisible"
      :data="editingTodo"
      @save="handleSave"
      @delete="handleDelete"
    />
  </div>
</template>

<style lang="scss" scoped>
.todo-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;

  .stats-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    .stat-item {
      text-align: center;

      .stat-value {
        font-size: 24px;
        font-weight: 500;
        color: #333;
        margin-bottom: 8px;
      }

      .stat-label {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .task-input {
    margin-bottom: 24px;

    .el-input {
      :deep(.el-input__wrapper) {
        padding-left: 16px;
        box-shadow: none;
        border: 1px solid #e4e7ed;

        &:hover,
        &:focus {
          border-color: var(--el-color-primary);
        }
      }
    }

    .quick-actions {
      margin-top: 12px;
      display: flex;
      gap: 8px;

      .el-tag {
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-1px);
        }
      }
    }
  }

  .todo-list {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    overflow: hidden;

    .todo-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #f0f0f0;
      transition: all 0.3s;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: #f9f9f9;
      }

      &.completed {
        .todo-title {
          color: #999;
          text-decoration: line-through;
        }
      }

      .todo-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .todo-actions {
        display: flex;
        align-items: center;
        gap: 16px;

        .pomodoro-count {
          font-size: 14px;
          color: #999;
        }
      }
    }
  }

  .empty-state {
    margin-top: 60px;
    text-align: center;

    img {
      width: 200px;
      margin-bottom: 20px;
    }
  }
}
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Plus } from '@element-plus/icons-vue';
import PomodoroTimer from "@/components/PomodoroTimer.vue";
import TodoDrawer from "./components/TodoDrawer.vue";
import { ElMessage } from "element-plus";
import { fetchTodos, updateTodo, removeTodo, createTodo } from "@/api/todo";

// 状态
const todos = ref([]);
const pomodoroTimer = ref(null);
const currentTask = ref(null);
const currentFilter = ref("all");
const drawerVisible = ref(false);
const editingTodo = ref(null);
const newTaskTitle = ref("");

// 快速添加任务标签
const quickTags = ["工作", "学习", "运动", "阅读"];

// 统计数据计算
const totalFocusTime = computed(() => {
  return todos.value.reduce((total, todo) => {
    return total + (todo.estimatedTime || 0) * 60;
  }, 0);
});

const totalCompletedTime = computed(() => {
  return todos.value.reduce((total, todo) => {
    return total + (todo.pomodoroCount || 0) * 25 * 60;
  }, 0);
});

// 格式化时间函数
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }
  return `${minutes}分钟`;
};

// 根据筛选条件过滤任务
const filteredTodos = computed(() => {
  switch (currentFilter.value) {
    case "urgent-important":
      return todos.value.filter((todo) => todo.quadrant === "1");
    case "completed":
      return todos.value.filter((todo) => todo.completed);
    case "statistics":
      return [];
    default:
      return todos.value;
  }
});

// 添加新任务
const addTodo = async () => {
  if (!newTaskTitle.value.trim()) return;
  
  try {
    const todo = {
      title: newTaskTitle.value,
      completed: false,
    };
    
    const response = await createTodo(todo);
    if (response.success) {
      await getTodos();
      newTaskTitle.value = "";
      ElMessage.success("添加成功");
    }
  } catch (error) {
    ElMessage.error("添加失败");
  }
};

// 快速添加预设任务
const addQuickTask = async (tag) => {
  try {
    const todo = {
      title: tag,
      completed: false,
    };
    
    const response = await createTodo(todo);
    if (response.success) {
      await getTodos();
      ElMessage.success("添加成功");
    }
  } catch (error) {
    ElMessage.error("添加失败");
  }
};

// 切换任务完成状态
const toggleTodo = async (todo) => {
  try {
    const response = await updateTodo({
      ...todo,
      completed: !todo.completed,
    });
    if (response.success) {
      const index = todos.value.findIndex((t) => t.id === todo.id);
      if (index !== -1) {
        todos.value[index] = response.data;
      }
    }
  } catch (error) {
    ElMessage.error("更新失败");
  }
};

// 编辑任务
const editTodo = (todo) => {
  editingTodo.value = { ...todo };
  drawerVisible.value = true;
};

// 删除任务
const deleteTodo = async (todo) => {
  try {
    const response = await removeTodo(todo.id);
    if (response.success) {
      await getTodos();
      ElMessage.success("删除成功");
    }
  } catch (error) {
    ElMessage.error("删除失败");
  }
};

// 开始番茄钟
const startPomodoro = (todo) => {
  currentTask.value = todo;
  pomodoroTimer.value?.toggleFullscreen();
};

// 获取所有任务
const getTodos = async () => {
  try {
    const response = await fetchTodos();
    if (response.success) {
      todos.value = response.data;
    }
  } catch (error) {
    ElMessage.error("获取任务列表失败");
  }
};

// 处理番茄钟完成
const handlePomodoroComplete = async () => {
  if (currentTask.value) {
    try {
      const updatedTodo = {
        ...currentTask.value,
        pomodoroCount: (currentTask.value.pomodoroCount || 0) + 1,
      };

      const response = await updateTodo(updatedTodo);
      if (response.success) {
        currentTask.value = response.data;
        ElMessage.success("完成一个番茄钟！");
      }
    } catch (error) {
      ElMessage.error("更新失败");
    }
  }
};

// 处理任务保存
const handleSave = async (todo) => {
  try {
    const response = await updateTodo(todo);
    if (response.success) {
      await getTodos();
      drawerVisible.value = false;
      ElMessage.success("保存成功");
    }
  } catch (error) {
    ElMessage.error("保存失败");
  }
};

// 处理任务删除
const handleDelete = async (todo) => {
  try {
    const response = await removeTodo(todo.id);
    if (response.success) {
      await getTodos();
      drawerVisible.value = false;
      ElMessage.success("删除成功");
    }
  } catch (error) {
    ElMessage.error("删除失败");
  }
};

// 监听筛选事件
const handleFilter = (event) => {
  currentFilter.value = event.detail;
};

onMounted(() => {
  getTodos();
  window.addEventListener("filter-todos", handleFilter);
});

onUnmounted(() => {
  window.removeEventListener("filter-todos", handleFilter);
});
</script>
