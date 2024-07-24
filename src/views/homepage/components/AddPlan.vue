<template>
  <div class="xxx_add">
    <el-button type="primary" @click="handleAddTodo">添加</el-button>
    <el-dialog v-model="showDialog" title="添加新的待办事项">
      <el-form label-width="120px">
        <el-form-item label="任务名称">
          <el-input v-model="newTodo.text" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="重要">
          <el-radio-group v-model="newTodo.important">
            <el-radio :value="1">是</el-radio>
            <el-radio :value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="紧急">
          <el-radio-group v-model="newTodo.urgent">
            <el-radio :value="1">是</el-radio>
            <el-radio :value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预计番茄钟">
          <el-rate
            v-model="newTodo.estimatedPomodoros"
            :icons="icons"
            :void-icon="Clock"
            :colors="['#409eff', '#67c23a', '#FF9900']"
            clearable
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="saveTodo">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { Clock } from "@element-plus/icons-vue";

const emit = defineEmits(["update"]);
const showDialog = ref(false);
const icons = [Clock, Clock, Clock, Clock, Clock];

const newTodo = ref({
  text: "",
  important: 0,
  urgent: 0,
  estimatedPomodoros: 0, // 预计番茄钟
});

function handleAddTodo() {
  showDialog.value = true;
}

watch(
  () => showDialog.value,
  (val) => {
    if (!val) {
      newTodo.value = { text: "", important: 0, urgent: 0, estimatedPomodoros: 0 };
    }
  }
);

function saveTodo() {
  if (newTodo.value.text.trim()) {
    emit("update", { ...newTodo.value, done: false });
    newTodo.value = { text: "", important: 0, urgent: 0, estimatedPomodoros: 0 };
    showDialog.value = false;
  }
}
</script>

<style scoped>
.xxx_add {
  display: flex;
}
.dialog-footer {
  text-align: right;
}
</style>
