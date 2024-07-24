<template>
    <el-drawer :visible.sync="visible" title="任务详情" direction="rtl">
      <p>任务内容: {{ todo.text }}</p>
      <p>完成状态: {{ todo.done ? '已完成' : '未完成' }}</p>
      <el-button @click="$emit('close')">关闭</el-button>
    </el-drawer>
  </template>
  
  <script setup>
  const props = defineProps({
    visible: Boolean,
    todo: Object
  });
  </script>
  