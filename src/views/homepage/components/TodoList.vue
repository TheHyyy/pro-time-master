<template>
  <div v-for="todo in todos">
    <el-checkbox v-model="todo.done" />
    <span :class="{ completed: todo.done }">{{ todo.text }}</span>
    <el-button @click="showDrawer = true" type="primary" icon="Edit" circle />
    <el-button @click="$emit('remove')" type="danger" icon="Delete" circle />
  </div>
</template>

<script setup>
import { ref } from "vue";
import TodoDrawer from "./TodoDrawer.vue";

const props = defineProps({
  todos: Object,
});

const showDrawer = ref(false);
</script>

<style scoped>
.completed {
  text-decoration: line-through;
  color: #999;
}
</style>
