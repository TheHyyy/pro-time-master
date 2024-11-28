<template>
  <div>
    <el-drawer
      :width="340"
      :model-value="visible"
      @open="handleOpen"
      @close="handleClose"
      unmountOnClose
    >
      <div>任务名：{{ data.text }}</div>
      <template #footer>
        <div>
          <el-button @click="handleDelete" type="danger" plain>删除</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  data: Object,
});
const emit = defineEmits(["update-visible", "delete"]);

const handleClick = () => {
  visible.value = true;
};
const handleOpen = (value) => {
  console.log("🚀 ~ openkkk ~ value:", value);
};
const handleClose = (value) => {
  console.log("🚀 ~ handleClose ~ value:", value);
  emit("update-visible", false);
};
const handleDelete = () => {
  emit("delete", props.data.id);
};
</script>
