<template>
  <div class="recurring-task-manager">
    <el-form :model="taskForm" label-width="100px">
      <el-form-item label="重复设置">
        <el-select v-model="taskForm.recurringType" placeholder="选择重复类型">
          <el-option label="不重复" value="none" />
          <el-option label="每天" value="daily" />
          <el-option label="每周" value="weekly" />
          <el-option label="每月" value="monthly" />
          <el-option label="自定义" value="custom" />
        </el-select>
      </el-form-item>

      <!-- 每周重复设置 -->
      <el-form-item v-if="taskForm.recurringType === 'weekly'" label="重复日期">
        <el-checkbox-group v-model="taskForm.weekDays">
          <el-checkbox label="1" border>周一</el-checkbox>
          <el-checkbox label="2" border>周二</el-checkbox>
          <el-checkbox label="3" border>周三</el-checkbox>
          <el-checkbox label="4" border>周四</el-checkbox>
          <el-checkbox label="5" border>周五</el-checkbox>
          <el-checkbox label="6" border>周六</el-checkbox>
          <el-checkbox label="0" border>周日</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <!-- 每月重复设置 -->
      <el-form-item v-if="taskForm.recurringType === 'monthly'" label="每月日期">
        <el-select v-model="taskForm.monthDay" placeholder="选择日期">
          <el-option
            v-for="day in 31"
            :key="day"
            :label="day + '日'"
            :value="day"
          />
        </el-select>
      </el-form-item>

      <!-- 自定义重复设置 -->
      <template v-if="taskForm.recurringType === 'custom'">
        <el-form-item label="重复间隔">
          <el-input-number v-model="taskForm.customInterval" :min="1" />
          <el-select v-model="taskForm.customUnit" style="margin-left: 10px">
            <el-option label="天" value="days" />
            <el-option label="周" value="weeks" />
            <el-option label="月" value="months" />
          </el-select>
        </el-form-item>
      </template>

      <!-- 重复结束设置 -->
      <el-form-item label="结束重复">
        <el-radio-group v-model="taskForm.endType">
          <el-radio label="never">永不</el-radio>
          <el-radio label="after">重复次数</el-radio>
          <el-radio label="on">截止日期</el-radio>
        </el-radio-group>

        <div v-if="taskForm.endType === 'after'" style="margin-top: 10px">
          <el-input-number
            v-model="taskForm.endAfterTimes"
            :min="1"
            placeholder="重复次数"
          />
          次后结束
        </div>

        <div v-if="taskForm.endType === 'on'" style="margin-top: 10px">
          <el-date-picker
            v-model="taskForm.endDate"
            type="date"
            placeholder="选择结束日期"
          />
        </div>
      </el-form-item>
    </el-form>

    <!-- 预览下次重复时间 -->
    <div class="next-occurrence" v-if="taskForm.recurringType !== 'none'">
      <p>下次重复时间：{{ nextOccurrenceText }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  initialRecurringSettings: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update']);

// 表单数据
const taskForm = ref({
  recurringType: 'none',
  weekDays: [],
  monthDay: 1,
  customInterval: 1,
  customUnit: 'days',
  endType: 'never',
  endAfterTimes: 1,
  endDate: null,
  ...props.initialRecurringSettings
});

// 计算下次重复时间
const nextOccurrenceText = computed(() => {
  const today = dayjs();
  let nextDate;

  switch (taskForm.value.recurringType) {
    case 'daily':
      nextDate = today.add(1, 'day');
      break;
    case 'weekly':
      if (taskForm.value.weekDays.length > 0) {
        const currentDay = today.day();
        const nextDays = taskForm.value.weekDays
          .map(Number)
          .filter(day => day > currentDay);
        if (nextDays.length > 0) {
          nextDate = today.add(nextDays[0] - currentDay, 'day');
        } else {
          nextDate = today.add(7 - currentDay + Number(taskForm.value.weekDays[0]), 'day');
        }
      }
      break;
    case 'monthly':
      const currentMonth = today.month();
      const targetDay = taskForm.value.monthDay;
      if (today.date() >= targetDay) {
        nextDate = today.month(currentMonth + 1).date(targetDay);
      } else {
        nextDate = today.date(targetDay);
      }
      break;
    case 'custom':
      nextDate = today.add(
        taskForm.value.customInterval,
        taskForm.value.customUnit
      );
      break;
  }

  return nextDate ? nextDate.format('YYYY-MM-DD') : '未设置';
});

// 监听表单变化并触发更新
watch(
  () => taskForm.value,
  (newValue) => {
    emit('update', newValue);
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.recurring-task-manager {
  padding: 20px;

  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .next-occurrence {
    margin-top: 20px;
    padding: 10px;
    background-color: #f5f7fa;
    border-radius: 4px;

    p {
      margin: 0;
      color: #606266;
      font-size: 14px;
    }
  }
}
</style>