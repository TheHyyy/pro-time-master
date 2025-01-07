<template>
  <div>
    <!-- 任务输入部分 -->
    <add-plan @update="saveTodo" />

    <!-- 未完成任务列表 -->
    <div class="todo_box">
      <TodoItem
        v-for="todo in unfinList"
        :key="todo.id"
        :todo="todo"
        @update-status="handleUpdateTodo"
        @click-title="handleClickTitle"
        @delete="handleDeleteTodo"
      />
    </div>

    <!-- 完成任务切换 -->
    <div
      v-if="completedList?.length"
      class="show_com_todo"
      @click="() => (showCompletedTodo = !showCompletedTodo)"
    >
      <div v-show="showCompletedTodo" class="show_com_todo_button">
        隐藏已完成任务 <el-icon><ArrowUp /></el-icon>
      </div>
      <div v-show="!showCompletedTodo" class="show_com_todo_button">
        显示已完成任务 <el-icon><ArrowDown /></el-icon>
      </div>
    </div>

    <!-- 已完成任务列表 -->
    <div v-show="showCompletedTodo && completedList.length" class="todo_box">
      <TodoItem
        v-for="todo in completedList"
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
      @update-visible="updateDrawerVisible"
      :data="currentTodoData"
      @delete="handleDeleteTodo"
      @update="getTodo"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import TodoDrawer from "./components/TodoDrawer.vue";
import TodoItem from "@/components/TodoItem.vue";
import AddPlan from ".//components/AddPlan.vue";
import { fetchTodos, createTodo, updateTodo, removeTodo } from "@/api/todo";

const todos = ref([]);
const showCompletedTodo = ref(false);
const showDrawer = ref(false);
const currentTodoData = ref({});
const unfinList = computed(() => todos.value.filter((todo) => !todo.completed));
const completedList = computed(() =>
  todos.value.filter((todo) => todo.completed)
);

async function getTodo() {
  const res = await fetchTodos();
  todos.value = res.data;
}

async function saveTodo(newTodo) {
  try {
    const res = await createTodo(newTodo);
    if (!res.success) {
      throw new Error("保存失败");
    }
    getTodo();
  } catch (error) {
    console.error(error);
    alert("保存任务失败，请稍后重试");
  }
}

async function handleUpdateTodo(todo) {
  try {
    todo.completed = !todo.completed;
    const res = await updateTodo(todo);
    if (!res.success) {
      throw new Error("更新任务失败");
    }
    getTodo();
  } catch (error) {
    alert("更新任务失败，请稍后重试");
  }
}

function handleClickTitle(todo) {
  currentTodoData.value = todo;
  showDrawer.value = true;
}

async function handleDeleteTodo(todo) {
  try {
    const res = await removeTodo(todo.id);
    if (!res.success) {
      throw new Error("删除任务失败");
    }
    getTodo();
  } catch (error) {
    console.error(error);
    alert("删除任务失败，请稍后重试");
  }
}

function updateDrawerVisible(value) {
  showDrawer.value = value;
}

onMounted(() => {
  getTodo();
});
</script>

<style scoped>
.todo_box {
  margin-top: 12px;
}
.show_com_todo {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
.show_com_todo_button {
  padding: 5px 12px;
  border-radius: 8px;
  background: #f5f5f5;
  cursor: pointer;
  transition: background-color 0.3s;
}
</style>
