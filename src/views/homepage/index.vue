<template>
  <div>
    <div>待办事项列表</div>
    <AddPlan @update="addNewTodo" />
    <div v-for="(todo, index) in todos" :key="index" class="todo-item">
      <TodoItem :todo="todo" @remove="removeTodo(index)" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import AddPlan from './components/AddPlan.vue';
import TodoItem from './components/TodoItem.vue';

const todos = ref([]);

// 从 localStorage 读取数据
function loadTodos() {
  const storedTodos = localStorage.getItem('todos');
  if (storedTodos) {
    todos.value = JSON.parse(storedTodos);
  }
}

function addNewTodo(newTodo) {
  todos.value.push(newTodo);
}

// 在 todos 变化时更新 localStorage
watch(
  todos,
  (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
  },
  { deep: true }
);

function removeTodo(index) {
  todos.value.splice(index, 1);
}

// 在组件挂载时加载数据
onMounted(() => {
  loadTodos();
});
</script>

<style scoped>
/* 你的样式可以在这里添加 */
.completed {
  text-decoration: line-through;
  color: #999;
}
</style>
