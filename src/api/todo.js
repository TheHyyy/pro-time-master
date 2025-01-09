import { http } from '@/composables/http';

/** 获取todos */
export const fetchTodos = () => {
  return http.get(`/todos`, {
    params: {},
  });
};

// 写入todo
export const createTodo = (todo) => {
  const todoData = {
    title: todo.title,
    description: todo.description || '',
    quadrant: todo.quadrant || '4'
  };
  
  return http.post('/todos', todoData);
};

// 更新todo
export const updateTodo = (todo) => {
  const todoData = {
    title: todo.title,
    description: todo.description,
    completed: todo.completed,
    quadrant: todo.quadrant
  };

  // 移除所有 undefined 的属性
  Object.keys(todoData).forEach(key => {
    if (todoData[key] === undefined) {
      delete todoData[key];
    }
  });

  return http.patch(`/todos/${todo.id}`, todoData);
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