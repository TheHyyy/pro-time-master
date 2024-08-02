<template>
  <div>
    <div class="todo_box">
      <div v-for="todo in unfinList" :key="todo.id" class="todo_item">
        <!-- 左侧展示区域 -->
        <!-- <div class="todo_item_header" >
          <el-popover
            :width="120"
            trigger="hover"
            :content="URGENT_LABEL_MAP[todo.priority]"
          >
            <template #reference>
              <el-icon :style="{ color: URGENT_COLOR_MAP[todo.priority] }"
                ><MessageBox
              /></el-icon>
            </template>
          </el-popover>
        </div> -->
        <!-- 操作区域 -->
        <div class="todo_item_content">
          <el-checkbox v-model="todo.done" @click.stop="playSound" />
          <div class="todo_item_text" @click="handleClickText(todo)">
            {{ todo.text }}
          </div>
          <div class="todo_item_tomato"></div>
        </div>
      </div>
    </div>
    <div
      v-if="completedList.length"
      class="show_com_todo"
      @click="() => (showCompletedTodo = !showCompletedTodo)"
    >
      <div class="show_com_todo_button" v-show="showCompletedTodo">
        隐藏已完成任务 <el-icon><ArrowUp /></el-icon>
      </div>
      <div class="show_com_todo_button" v-show="!showCompletedTodo">
        显示未完成任务
        <el-icon><ArrowDown /></el-icon>
      </div>
    </div>
    <div v-show="showCompletedTodo" class="todo_box">
      <div v-for="todo in completedList" :key="todo.id" class="todo_item">
        <div class="todo_item_content">
          <el-checkbox v-model="todo.done" />
          <div
            :class="['todo_item_text', { todo_item_text_completed: todo.done }]"
          >
            {{ todo.text }}
          </div>
        </div>
      </div>
    </div>
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
import TodoDrawer from "./TodoDrawer.vue";
import {
  URGENT_COLOR_MAP, // color的map
  URGENT_LABEL_MAP,
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
const showCompletedTodo = ref(false);
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

// 监听todos变化
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
const currentTodoData = ref({});
const handleClickText = (todo) => {
  // 记录当前数据
  currentTodoData.value = todo;
  // 打开抽屉
  showDrawer.value = true;
};

// 抽屉中触发更新visible
const updateDrawerVisible = (value) => {
  showDrawer.value = value;
  // console.log("🚀 ~ updateDrawerVisible ~ showDrawer.value:", showDrawer.value);
};

// 播放音效
const playSound = () => {
  const audio = new Audio("/check-sound.mp3");
  // console.log("🚀 ~ playSound ~ audio:", audio);
  audio.play();
};
// 删除todo
const handleDeleteTodo = (id) => {
  // console.log("🚀 ~ handleDeleteTodo ~ id:", id);
  todos.value = todos.value.filter((todo) => todo.id !== id);
  showDrawer.value = false;
  currentTodoData.value = {};
};
onMounted(() => {
  loadTodos();
});
</script>

<style lang="scss" scoped>
.todo_box {
  margin-top: 12px;
}
.todo_item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  height: 40px;
  overflow: hidden;
  border: 1px solid #eee;
  // 左侧展示区域
  .todo_item_header {
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #eee;
    background: #f4f4f5;

    height: 100%;
  }
  // 中间区域
  .todo_item_content {
    display: flex;
    align-items: center;
    padding: 10px;
    .todo_item_text {
      margin-left: 10px;
      color: #333;
      font-size: 16px;
      cursor: pointer;
      min-width: 200px;
    }

    .todo_item_text_completed {
      text-decoration: line-through;
      color: #999;
      cursor: default;
    }
  }
}
.todo_item_completed {
}
/* 显示已完成todo */
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
}
</style>
