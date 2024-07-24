<template>
  <el-dialog v-model="showDialog" :title="dialogTitle">
    <el-form label-width="120px">
      <el-form-item label="任务名称">
        <el-input v-model="localTodo.text" placeholder="请输入任务名称" />
      </el-form-item>
      <el-form-item label="重要">
        <el-radio-group v-model="localTodo.important">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="紧急">
        <el-radio-group v-model="localTodo.urgent">
          <el-radio :value="1">是</el-radio>
          <el-radio :value="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预计番茄钟">
        <el-rate
          v-model="localTodo.estimatedPomodoros"
          :icons="icons"
          :void-icon="Clock"
          :colors="['#409eff', '#67c23a', '#FF9900']"
          clearable
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="saveTodo">确定</el-button>
    </span>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { Clock } from "@element-plus/icons-vue";

const props = defineProps({
  todo: Object,
  visible: Boolean
});

const emit = defineEmits(["update", "close"]);
const showDialog = ref(props.visible);
const icons = [Clock, Clock, Clock, Clock, Clock];

const localTodo = ref({
  id: null,
  text: "",
  important: 0,
  urgent: 0,
  estimatedPomodoros: 0, // 预计番茄钟
});

const dialogTitle = ref("添加新的待办事项");

watch(
  () => props.todo,
  (newVal) => {
    if (newVal) {
      localTodo.value = { ...newVal };
      dialogTitle.value = "编辑待办事项";
      showDialog.value = true;
    } else {
      resetTodo();
    }
  },
  { immediate: true }
);

watch(
  () => props.visible,
  (val) => {
    showDialog.value = val;
  }
);

function resetTodo() {
  localTodo.value = {
    id: null,
    text: "",
    important: 0,
    urgent: 0,
    estimatedPomodoros: 0
  };
  dialogTitle.value = "添加新的待办事项";
}

function saveTodo() {
  if (localTodo.value.text.trim()) {
    emit("update", { ...localTodo.value, done: false });
    closeDialog();
  }
}

function closeDialog() {
  emit("close");
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
