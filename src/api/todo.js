import { offlineStorage } from '@/utils/offlineStorage';

/** 获取todos */
export const fetchTodos = () => {
  return http.get(`/todos`, {
    params: {},
  });
};

// 写入todo
export const createTodo = async (todo) => {
  try {
    const response = await http.post('/todos', todo);
    return response;
  } catch (error) {
    if (!navigator.onLine) {
      // 离线状态下保存到 IndexedDB
      await offlineStorage.saveTodo({
        ...todo,
        id: Date.now(), // 临时 ID
        pendingSync: true
      });
      return {
        success: true,
        data: todo,
        offline: true
      };
    }
    throw error;
  }
};

// 更新todo
export const updateTodo = async (todo) => {
  try {
    const response = await http.patch(`/todos/${todo.id}`, todo);
    return response;
  } catch (error) {
    if (!navigator.onLine) {
      await offlineStorage.saveTodo({
        ...todo,
        pendingSync: true
      });
      return {
        success: true,
        data: todo,
        offline: true
      };
    }
    throw error;
  }
};

// 删除todo
export const removeTodo = (id) => {
  return http.delete(`/todos/${id}`);
};