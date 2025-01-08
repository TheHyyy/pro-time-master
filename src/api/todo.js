import { http } from '@/composables/http';

/** 获取todos */
export const fetchTodos = () => {
  return http.get(`/todos`, {
    params: {},
  });
};

// 写入todo
export const createTodo = (todo) => {
  return http.post('/todos', todo);
};

// 更新todo
export const updateTodo = (todo) => {
  return http.patch(`/todos/${todo.id}`, todo);
};

// 删除todo
export const removeTodo = (id) => {
  return http.delete(`/todos/${id}`);
};

// 获取任务统计信息
export const getTodoStats = () => {
  return http.get('/todos/stats');
};

// 更新番茄钟完成数
export const updateTodoPomodoros = (id) => {
  return http.patch(`/todos/${id}/pomodoros`);
};