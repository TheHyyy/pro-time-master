<template>
  <div class="todo-list">
    <!-- 未完成任务列表 -->
    <div class="todo-section">
      <TodoItem
        v-for="todo in unfinishedTodos"
        :key="todo.id"
        :todo="todo"
        @update-status="handleUpdateTodo"
        @click-title="handleClickTitle"
        @delete="handleDeleteTodo"
        @start-pomodoro="$emit('select-task', todo)"
      />
    </div>

    <!-- 完成任务切换按钮 -->
    <div
      v-if="completedTodos.length"
      class="completed-toggle"
      @click="toggleCompletedTodos"
    >
      <div class="toggle-button">
        {{ showCompleted ? '隐藏已完成任务' : '显示已完成任务' }}
        <el-icon>
          <component :is="showCompleted ? 'ArrowUp' : 'ArrowDown'" />
        </el-icon>
      </div>
    </div>

    <!-- 已完成任务列表 -->
    <div v-show="showCompleted" class="todo-section completed-section">
      <TodoItem
        v-for="todo in completedTodos"
        :key="todo.id"
        :todo="todo"
        @update-status="handleUpdateTodo"
        @click-title="handleClickTitle"
        @delete="handleDeleteTodo"
      />
    </div>

    <!-- 任务详情抽屉 -->
    <TodoDrawer
      :visible="showDrawer"
      :data="currentTodo"
      @update-visible="updateDrawerVisible"
      @delete="handleDeleteTodo"
      @update="$emit('update')"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import TodoItem from '@/components/TodoItem.vue';
import TodoDrawer from './TodoDrawer.vue';
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';

const props = defineProps({
  todos: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update', 'delete', 'select-task']);

const showCompleted = ref(false);
const showDrawer = ref(false);
const currentTodo = ref(null);

// 计算未完成和已完成的任务列表
const unfinishedTodos = computed(() => 
  props.todos.filter(todo => !todo.completed)
);

const completedTodos = computed(() => 
  props.todos.filter(todo => todo.completed)
);

// 切换显示/隐藏已完成任务
const toggleCompletedTodos = () => {
  showCompleted.value = !showCompleted.value;
};

// 处理任务状态更新
const handleUpdateTodo = (todo) => {
  emit('update', todo);
};

// 处理任务删除
const handleDeleteTodo = (todo) => {
  emit('delete', todo);
};

// 处理任务标题点击，打开详情抽屉
const handleClickTitle = (todo) => {
  currentTodo.value = todo;
  showDrawer.value = true;
};

// 更新抽屉可见性
const updateDrawerVisible = (visible) => {
  showDrawer.value = visible;
};
</script>

<style lang="scss" scoped>
.todo-list {
  .todo-section {
    margin: 12px 0;
  }

  .completed-toggle {
    display: flex;
    justify-content: center;
    margin: 16px 0;

    .toggle-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background-color: #f5f5f5;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #e8e8e8;
      }
    }
  }

  .completed-section {
    opacity: 0.7;
  }
}
</style> 