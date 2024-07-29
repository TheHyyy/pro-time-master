<template>
  <div>
    已完成：
    <div v-for="todo in unfinList">
      <el-checkbox v-model="todo.done" />
      <span>{{ todo.text }}</span>
      <el-button @click="showDrawer = true" type="primary" icon="Edit" circle />
      <el-button @click="$emit('remove')" type="danger" icon="Delete" circle />
    </div>
    未完成：
    <div v-for="todo in completedList">
      <el-checkbox v-model="todo.done" />
      <span :class="{ completed: todo.done }">{{ todo.text }}</span>
      <el-button @click="showDrawer = true" type="primary" icon="Edit" circle />
      <el-button @click="$emit('remove')" type="danger" icon="Delete" circle />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import TodoDrawer from "./TodoDrawer.vue";
import {
  // 紧急程度
  URGENT_IMPORTANT, // 紧急 重要
  URGENT_NOT_IMPORTANT, // 紧急 不重要
  NOT_URGENT_IMPORTANT, // 不紧急 重要
  NOT_URGENT_NOT_IMPORTANT, // 不紧急 不重要
  URGENT_IMPORTANT_COLOR, // 紧急 重要color
  URGENT_NOT_IMPORTANT_COLOR, // 紧急 不重要color
  NOT_URGENT_IMPORTANT_COLOR, // 不紧急 重要color
  NOT_URGENT_NOT_IMPORTANT_COLOR, // 不紧急 不重要color
} from "@/constant/todo";

const todos = ref([]);
// 从 localStorage 读取数据
function loadTodos() {
  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) {
    todos.value = JSON.parse(storedTodos);
  }
}
// 已完成list
const unfinList = computed(() => {
  return todos.value.filter((todo) => !todo.done);
});
// 已完成list
const completedList = computed(() => {
  return todos.value.filter((todo) => todo.done);
});
watch(
  todos,
  (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
    setTimeout(() => {
      loadTodos();
    }, 0);
  },
  { deep: true }
);
const showDrawer = ref(false);
onMounted(() => {
  loadTodos();
});
</script>

<style scoped>
.completed {
  text-decoration: line-through;
  color: #999;
}
</style>
