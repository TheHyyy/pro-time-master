<template>
  <div class="todo_list_page">
    <div class="common-layout">
      <el-container>
        <el-header></el-header>
        <el-container>
          <el-aside width="200px">
            <div class="aside">
              <div class="aside_list">
                <div class="aside_list_item">
                  <div class="aside_list_item_icon">
                    <el-icon color="#d9f3e2;"><Sunny /></el-icon>
                  </div>
                  <div class="aside_list_item_text">所有</div>
                </div>
              </div>
            </div>
          </el-aside>
          <el-main>
            <div class="main">
              <AddPlan
                :visible="isAddDialogVisible"
                @close="closeAddDialog"
                @update="addNewTodo"
              />
              <TodoList :todos="todos" />
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import AddPlan from "./components/AddPlan.vue";
import TodoList from "./components/TodoList.vue";
import { Sunny } from "@element-plus/icons-vue";

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
  todos.value.unshift(newTodo);
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
.todo_list_page {
  min-height: 100vh;
}
.main {
  background: #f7f7fa;
}

.aside_list_item {
  display: flex;
  align-items: center;
  padding: 10px;

  background: #f3f3f3;
  border-radius: 12px;
  cursor: pointer;
}
</style>
