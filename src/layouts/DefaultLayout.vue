<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="layout-aside">
      <div class="logo">专注清单</div>
      <el-menu
        :default-active="activeMenu"
        class="menu"
        @select="handleMenuSelect"
      >
        <el-menu-item index="all">
          <el-icon><List /></el-icon>
          <span>所有任务</span>
        </el-menu-item>

        <el-menu-item index="urgent-important">
          <el-icon><Warning /></el-icon>
          <span>重要紧急</span>
        </el-menu-item>

        <el-menu-item index="completed">
          <el-icon><Select /></el-icon>
          <span>已完成</span>
        </el-menu-item>

        <el-menu-item index="statistics">
          <el-icon><DataLine /></el-icon>
          <span>数据统计</span>
        </el-menu-item>
      </el-menu>
      
      <div class="menu-footer">
        <el-button 
          text
          @click="showSettings = true"
          class="settings-btn"
        >
          <el-icon><Setting /></el-icon>
          <span>设置</span>
        </el-button>
      </div>
    </el-aside>

    <el-container class="main-container">
      <el-main class="layout-main">
        <router-view></router-view>
      </el-main>
    </el-container>

    <el-dialog
      title="设置"
      v-model="showSettings"
      width="460px"
      class="settings-dialog"
    >
      <el-form :model="settings" label-width="120px">
        <h4>番茄钟设置</h4>
        <el-form-item label="工作时长(分钟)">
          <el-input-number v-model="settings.workTime" :min="1" :max="60" />
        </el-form-item>
        <el-form-item label="短休息时长">
          <el-input-number v-model="settings.shortBreakTime" :min="1" :max="30" />
        </el-form-item>
        <el-form-item label="长休息时长">
          <el-input-number v-model="settings.longBreakTime" :min="5" :max="60" />
        </el-form-item>
        <el-form-item label="自动开始休息">
          <el-switch v-model="settings.autoStartBreaks" />
        </el-form-item>
        <el-form-item label="自动开始工作">
          <el-switch v-model="settings.autoStartPomodoros" />
        </el-form-item>

        <h4>声音设置</h4>
        <el-form-item label="提醒铃声">
          <el-select v-model="settings.sound" style="width: 200px">
            <el-option label="默认铃声" value="default" />
            <el-option label="温和提示音" value="gentle" />
          </el-select>
          <el-button @click="playSound" size="small" style="margin-left: 10px">
            试听
          </el-button>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showSettings = false">取消</el-button>
        <el-button type="primary" @click="saveSettings">保存</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { List, Warning, Select, DataLine, Setting } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { pomodoroStorage } from '@/utils/pomodoroStorage';

const activeMenu = ref('all');

const currentPage = computed(() => {
  switch(activeMenu.value) {
    case 'all': return '全部任务';
    case 'urgent-important': return '紧急且重要';
    case 'completed': return '已完成';
    case 'statistics': return '图表统计';
    default: return '全部任务';
  }
});

const handleMenuSelect = (index) => {
  activeMenu.value = index;
  window.dispatchEvent(new CustomEvent('filter-todos', { detail: index }));
};

const showSettings = ref(false);
const settings = ref(pomodoroStorage.getSettings());

const saveSettings = () => {
  pomodoroStorage.saveSettings(settings.value);
  showSettings.value = false;
  ElMessage.success('设置已保存');
};

const playSound = () => {
  const audio = new Audio(`/sounds/${settings.value.sound}.mp3`);
  audio.play();
};
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  background-color: #f5f7fa;

  .layout-aside {
    background-color: #fff;
    border-right: 1px solid #e6e6e6;
    display: flex;
    flex-direction: column;
    transition: width 0.3s;
    overflow: hidden;

    .logo {
      height: 64px;
      line-height: 64px;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      color: #333;
      border-bottom: 1px solid #f0f0f0;
    }

    .menu {
      border-right: none;
      flex: 1;

      :deep(.el-menu-item) {
        height: 50px;
        line-height: 50px;
        margin: 4px 0;
        padding: 0 20px;
        border-radius: 0 24px 24px 0;
        margin-right: 12px;

        &.is-active {
          background-color: #f0f7ff;
          color: var(--el-color-primary);
        }

        .el-icon {
          margin-right: 12px;
          font-size: 18px;
        }
      }
    }

    .menu-footer {
      padding: 16px;
      border-top: 1px solid #f0f0f0;

      .settings-btn {
        width: 100%;
        justify-content: flex-start;
        padding: 8px 12px;
        color: #666;
        
        .el-icon {
          margin-right: 8px;
          font-size: 16px;
        }

        &:hover {
          color: var(--el-color-primary);
          background-color: #f0f7ff;
        }
      }
    }
  }

  .main-container {
    background-color: #f5f7fa;
  }

  .layout-main {
    padding: 24px;
    height: 100%;
    overflow-y: auto;
  }
}

:deep(.settings-dialog) {
  .el-dialog__header {
    margin: 0;
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
  }

  .el-dialog__body {
    padding: 24px;

    h4 {
      margin: 16px 0;
      padding-bottom: 12px;
      border-bottom: 1px solid #f0f0f0;
      color: #333;
      font-size: 15px;
      font-weight: 500;
    }
  }

  .el-dialog__footer {
    padding: 16px 24px;
    border-top: 1px solid #f0f0f0;
  }
}
</style>
