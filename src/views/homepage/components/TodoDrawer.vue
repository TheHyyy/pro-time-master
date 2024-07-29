<template>
  <div>
    visible:{{ visible }}
    <el-drawer
      :width="340"
      :model-value="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      unmountOnClose
    >
      <div>
        You can customize modal body text by the current situation. This modal
        will be closed immediately once you press the OK button.
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
});

const handleClick = () => {
  visible.value = true;
};
const handleOk = () => {
  visible.value = false;
};
const handleCancel = () => {
  visible.value = false;
};
</script>
