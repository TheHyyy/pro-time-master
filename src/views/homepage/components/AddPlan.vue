<template>
  <div>
    <el-input
      v-model="localTodo.text"
      placeholder="在'任务'中添加一个任务，按'回车'键保存"
      @keyup.enter="saveTodo"
    >
      <template #prepend>
        <el-select
          v-model="localTodo.important"
          placeholder="Select"
          size="large"
          style="width: 80px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <div class="select_option">
              <div class="select_option_label1">
                {{ item.label1 }}
              </div>
              <div class="select_option_label2">
                {{ item.label2 }}
              </div>
              <div class="select_option_icon">
                <el-icon :style="{ color: item.color || '#3f8ef7' }"
                  ><MessageBox
                /></el-icon>
              </div>
            </div>
          </el-option>
          <template #label>
            <div class="select_label">
              <el-icon
                :style="{
                  color: options.find(
                    (item) => item.value == localTodo.important
                  )?.color,
                }"
                ><MessageBox
              /></el-icon>
            </div>
          </template>
        </el-select>
        <!-- <el-popover
          placement="bottom"
          title="Title"
          :width="200"
          trigger="click"
          content="this is content, this is content, this is content"
        >
          <template #reference>
            <el-icon style="color: #3f8ef7"><MessageBox /></el-icon>
          </template>
          <div>
            asdasdasd12312
          </div>
        </el-popover> -->
      </template>
      <template #append>
        <el-rate
          v-model="localTodo.estimatedPomodoros"
          :icons="icons"
          :void-icon="Clock"
          :colors="['#409eff', '#67c23a', '#FF9900']"
          clearable
        />
      </template>
    </el-input>
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
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { Clock } from "@element-plus/icons-vue";

const props = defineProps({
  todo: Object,
  visible: Boolean,
});

const emit = defineEmits(["update", "close"]);
const showDialog = ref(props.visible);
const icons = [Clock, Clock, Clock, Clock, Clock];
const options = [
  {
    value: "1",
    label1: "紧急",
    label2: "重要",
    color: "#E47470",
  },
  {
    value: "2",
    label1: "紧急",
    label2: "不重要",
    color:"#DCA550"
  },
  {
    value: "3",
    label1: "不紧急",
    label2: "重要",
    color: "#7EC050",
  },
  {
    value: "4",
    label1: "不紧急",
    label2: "不重要",
    color: "#5A9CF8",
  },
];
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
    estimatedPomodoros: 0,
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
.select_label{
  display: flex;
  justify-content: center;
  align-items: center;
}
.select_option {
  display: flex;
}
.select_option_label1 {
  width: 80px;
}
.select_option_label2 {
  width: 80px;
}
.select_option_icon {
  flex: 1;
  display: flex;
  justify-content: right;
  align-items: center;
}
</style>
