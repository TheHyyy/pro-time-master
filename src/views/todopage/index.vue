<template>
  <div class="todo-page">
    <!-- 现有的待办事项列表 -->
    <div class="todo-list">
      <AddTodo @add="handleAddTodo" />
      <TodoList 
        :todos="todos" 
        @update="handleUpdateTodo"
        @delete="handleDeleteTodo"
        @select-task="selectTaskForPomodoro"
      />
    </div>

    <!-- 悬浮番茄钟 -->
    <div class="floating-timer" @click="openTimer">
      <PomodoroTimer 
        ref="pomodoroTimer"
        :task="currentTask"
        @pomodoro-complete="handlePomodoroComplete"
      />
    </div>

    <!-- 统计信息 -->
    <Statistics v-if="showStatistics" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AddTodo from './components/AddTodo.vue';
import TodoList from './components/TodoList.vue';
import PomodoroTimer from '@/components/PomodoroTimer.vue';
import Statistics from '@/components/Statistics.vue';
import { fetchTodos, updateTodo, removeTodo } from '@/api/todo';

const todos = ref([]);
const pomodoroTimer = ref(null);
const currentTask = ref({
  title: '专注计时',
  completed: false,
  completedPomodoros: 0
});
const showStatistics = ref(false);

// 获取所有任务
const getTodos = async () => {
  try {
    const response = await fetchTodos();
    if (response.success) {
      todos.value = response.data;
    }
  } catch (error) {
    ElMessage.error('获取任务列表失败');
  }
};

// 处理添加任务
const handleAddTodo = async (todo) => {
  try {
    const response = await createTodo(todo);
    if (response.success) {
      await getTodos();
      ElMessage.success('添加成功');
    }
  } catch (error) {
    ElMessage.error('添加失败');
  }
};

// 处理更新任务
const handleUpdateTodo = async (todo) => {
  console.log("🚀 ~ handleUpdateTodo ~ todo:", todo)
  try {
    const response = await updateTodo(todo);
    console.log("🚀 ~ handleUpdateTodo ~ response:", response)
    if (response.success) {
      await getTodos();
    }
  } catch (error) {
    ElMessage.error('更新失败');
  }
};

// 处理删除任务
const handleDeleteTodo = async (todo) => {
  try {
    const response = await removeTodo(todo.id);
    if (response.success) {
      await getTodos();
      ElMessage.success('删除成功');
    }
  } catch (error) {
    ElMessage.error('删除失败');
  }
};

// 打开番茄钟全屏模式
const openTimer = () => {
  pomodoroTimer.value?.toggleFullscreen();
};

// 处理番茄钟完成
const handlePomodoroComplete = async () => {
  if (currentTask.value) {
    try {
      const updatedTodo = {
        ...currentTask.value,
        completedPomodoros: (currentTask.value.completedPomodoros || 0) + 1
      };
      
      const response = await updateTodo(updatedTodo);
      if (response.success) {
        currentTask.value = response.data;
        ElMessage.success('完成一个番茄钟！');
      }
    } catch (error) {
      ElMessage.error('更新失败');
    }
  }
};

// 选择当前任务进行番茄钟计时
const selectTaskForPomodoro = (todo) => {
  currentTask.value = todo;
  openTimer();
};

// 页面加载时获取任务列表
onMounted(() => {
  getTodos();
});
</script>

<style lang="scss" scoped>
.todo-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  padding: 20px;

  .todo-list {
    flex: 1;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
  }

  .floating-timer {
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
  }
}
</style>
