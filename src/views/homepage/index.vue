<template>
  <div>
    <div>待办事项列表</div>
    <el-button type="primary" @click="openAddDialog">添加任务</el-button>
    <AddPlan
      :visible="isAddDialogVisible"
      @close="closeAddDialog"
      @update="addNewTodo"
    />
    <AddPlan
      :visible="isEditDialogVisible"
      :todo="editingTodo"
      @close="closeEditDialog"
      @update="updateTodo"
    />
    <TodoList :todos="todos"  />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import AddPlan from "./components/AddPlan.vue";
import TodoList from "./components/TodoList.vue";

const todos = ref([]);
const isAddDialogVisible = ref(false);
const isEditDialogVisible = ref(false);
const editingTodo = ref(null);

// 从 localStorage 读取数据
function loadTodos() {
  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) {
    todos.value = JSON.parse(storedTodos);
  }
}

function openAddDialog() {
  isAddDialogVisible.value = true;
}

function closeAddDialog() {
  isAddDialogVisible.value = false;
}

function addNewTodo(newTodo) {
  newTodo.id = Date.now(); // Assign a unique ID
  todos.value.push(newTodo);
  isAddDialogVisible.value = false;
}

function updateTodo(updatedTodo) {
  const index = todos.value.findIndex((todo) => todo.id === updatedTodo.id);
  if (index !== -1) {
    todos.value[index] = updatedTodo;
  }
  isEditDialogVisible.value = false;
}

function removeTodo(index) {
  todos.value.splice(index, 1);
}

function editTodo(todo) {
  editingTodo.value = { ...todo };
  isEditDialogVisible.value = true;
}

function closeEditDialog() {
  isEditDialogVisible.value = false;
}

// 在 todos 变化时更新 localStorage
watch(
  todos,
  (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
  },
  { deep: true }
);

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
