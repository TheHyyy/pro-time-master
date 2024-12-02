<template>
  <div>
    <!-- 任务输入部分 -->
    <el-input
      v-model="localTodo.title"
      placeholder="在'任务'中添加一个任务，按'回车'键保存"
      @keyup.enter="saveTodo"
    >
      <template #prepend>
        <el-select
          v-model="localTodo.priority"
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
                <el-icon :style="{ color: item.color || '#3f8ef7' }">
                  <MessageBox />
                </el-icon>
              </div>
            </div>
          </el-option>
          <template #label>
            <div class="select_label">
              <el-icon
                :style="{
                  color: options.find(
                    (item) => item.value == localTodo.priority
                  )?.color,
                }"
              >
                <MessageBox />
              </el-icon>
            </div>
          </template>
        </el-select>
      </template>
      <template #append>
        <el-popover
          placement="top-start"
          :width="200"
          trigger="hover"
          content="预计番茄钟~"
        >
          <template #reference>
            <el-rate
              v-model="localTodo.estimatedPomodoros"
              :icons="icons"
              :void-icon="Clock"
              :colors="['#409eff', '#67c23a', '#FF9900']"
              clearable
            />
          </template>
        </el-popover>
      </template>
    </el-input>

    <!-- 任务展示部分 -->
    <div class="todo_box">
      <TodoItem
        v-for="todo in unfinList"
        :key="todo.id"
        :todo="todo"
        @update-status="handleUpdateTodo"
        @click-title="handleClickTitle"
      />
    </div>

    <div
      v-if="completedList?.length"
      class="show_com_todo"
      @click="() => (showCompletedTodo = !showCompletedTodo)"
    >
      <div class="show_com_todo_button" v-show="showCompletedTodo">
        隐藏已完成任务 <el-icon><ArrowUp /></el-icon>
      </div>
      <div class="show_com_todo_button" v-show="!showCompletedTodo">
        显示已完成任务 <el-icon><ArrowDown /></el-icon>
      </div>
    </div>

    <div v-show="showCompletedTodo && completedList.length" class="todo_box">
      <TodoItem
        v-for="todo in completedList"
        :key="todo.id"
        :todo="todo"
        @update-status="handleUpdateTodo"
        @click-title="handleClickTitle"
      />
    </div>

    <!-- 任务详情抽屉 -->
    <TodoDrawer
      :visible="showDrawer"
      @update-visible="updateDrawerVisible"
      :data="currentTodoData"
      @delete="handleDeleteTodo"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import TodoDrawer from "./components/TodoDrawer.vue";
import TodoItem from "@/components/TodoItem.vue";
import { Clock, ArrowDown, ArrowUp, MessageBox } from "@element-plus/icons-vue";
import {
  URGENT_IMPORTANT,
  URGENT_NOT_IMPORTANT,
  NOT_URGENT_IMPORTANT,
  NOT_URGENT_NOT_IMPORTANT,
  URGENT_IMPORTANT_COLOR,
  URGENT_NOT_IMPORTANT_COLOR,
  NOT_URGENT_IMPORTANT_COLOR,
  NOT_URGENT_NOT_IMPORTANT_COLOR,
} from "@/constant/todo";
import { getTodos, addTodo, updateTodo } from "@/api/todo";

// 数据和状态管理
const todos = ref([]);
const showCompletedTodo = ref(false);
const showDrawer = ref(false);
const currentTodoData = ref({});
const localTodo = ref({
  id: null,
  title: "",
  priority: NOT_URGENT_NOT_IMPORTANT,
  estimatedPomodoros: 0,
});

const icons = [Clock, Clock, Clock, Clock, Clock];
const options = [
  {
    value: URGENT_IMPORTANT,
    label1: "紧急",
    label2: "重要",
    color: URGENT_IMPORTANT_COLOR,
  },
  {
    value: URGENT_NOT_IMPORTANT,
    label1: "紧急",
    label2: "不重要",
    color: URGENT_NOT_IMPORTANT_COLOR,
  },
  {
    value: NOT_URGENT_IMPORTANT,
    label1: "不紧急",
    label2: "重要",
    color: NOT_URGENT_IMPORTANT_COLOR,
  },
  {
    value: NOT_URGENT_NOT_IMPORTANT,
    label1: "不紧急",
    label2: "不重要",
    color: NOT_URGENT_NOT_IMPORTANT_COLOR,
  },
];

// 计算属性
const unfinList = computed(() =>
  todos.value?.filter((todo) => !todo.completed)
);
const completedList = computed(() =>
  todos.value?.filter((todo) => todo.completed)
);

// 从 localStorage 加载数据
function loadTodos() {
  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) {
    todos.value = JSON.parse(storedTodos);
  }
}

// 监听 todos 数据变化
watch(
  todos,
  (newTodos) => {
    if (newTodos) {
      localStorage.setItem("todos", JSON.stringify(newTodos));
    }
  },
  { deep: true }
);

// 处理任务的保存
async function saveTodo() {
  let title = localTodo.value.title;
  if (!title.trim()) {
    return;
  }
  const newTodo = { ...localTodo.value };
  todos.value.push(newTodo); // 本地更新任务列表
  try {
    const res = await addTodo({ title });
    if (res.code === 200) {
      getTodos();
      resetTodo();
    }
  } catch (error) {
    console.error("添加任务失败", error);
    alert("添加任务失败，请稍后再试");
  }
}

// 重置当前任务数据
function resetTodo() {
  localTodo.value = {
    id: null,
    title: "",
    priority: NOT_URGENT_NOT_IMPORTANT,
    estimatedPomodoros: 0,
  };
}
const updateTodoStatus = async (todo, targetCompleted) => {
  try {
    const res = await updateTodo({ id: todo.id, completed: targetCompleted });
    if (res.code !== 200) {
      throw new Error("更新任务失败");
    }
    return res;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
let isAudioPlayed = false;
const handleUpdateTodo = async (todo) => {
  const targetCompleted = !todo.completed;
  todo.completed = targetCompleted; // 乐观更新
  try {
    await updateTodoStatus(todo, targetCompleted);
    getTodo(); // 重新获取任务列表
    if (!isAudioPlayed) {
      const audio = new Audio("/check-sound.mp3");
      audio.play();
      isAudioPlayed = true;
      setTimeout(() => {
        isAudioPlayed = false;
      }, 500); // 500ms后允许再次播放音效
    }
  } catch (error) {
    todo.completed = !targetCompleted; // 恢复任务状态
    alert("更新任务失败，请稍后再试");
  }
};

// 处理任务文本点击，打开任务详情
const handleClickTitle = (todo) => {
  currentTodoData.value = todo;
  showDrawer.value = true;
};

// 更新抽屉的可见性
const updateDrawerVisible = (value) => {
  showDrawer.value = value;
};

// 删除任务
const handleDeleteTodo = (id) => {
  todos.value = todos.value.filter((todo) => todo.id !== id);
  showDrawer.value = false;
  currentTodoData.value = {};
};

// 获取任务数据
async function getTodo() {
  const res = await getTodos();
  todos.value = res.data;
}

// 挂载时加载任务数据
onMounted(() => {
  loadTodos();
  getTodo();
});
</script>

<style lang="scss" scoped>
.todo_box {
  margin-top: 12px;
}
.show_com_todo {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.show_com_todo_button {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  color: #999;
  padding: 2px 16px;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f5f5f5;
  }
}
</style>
