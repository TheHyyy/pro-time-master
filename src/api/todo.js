import { http } from '@/composables/http';
import { offlineStorage } from '@/utils/offlineStorage';

// 获取所有任务(包括本地存储的任务)
export const fetchTodos = async () => {
  try {
    // 获取本地存储的任务
    const localTodos = await offlineStorage.getTodos();
    
    // 如果已登录,则同时获取服务器任务
    const token = localStorage.getItem('token');
    if (token) {
      const response = await http.get('/todos');
      if (response.success) {
        // 合并本地和服务器任务,去重
        const serverTodos = response.data;
        const mergedTodos = [...localTodos, ...serverTodos].reduce((acc, curr) => {
          if (!acc.find(todo => todo.id === curr.id)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        return {
          success: true,
          data: mergedTodos
        };
      }
    }
    
    // 未登录或请求失败时返回本地任务
    return {
      success: true,
      data: localTodos
    };
  } catch (error) {
    return {
      success: true,
      data: await offlineStorage.getTodos()
    };
  }
};

// 创建任务
export const createTodo = async (todo) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      // 已登录,保存到服务器
      const response = await http.post('/todos', todo);
      if (response.success) {
        // 同时保存到本地
        await offlineStorage.saveTodo(response.data);
        return response;
      }
    }
    
    // 未登录或请求失败,只保存到本地
    const localTodo = {
      ...todo,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await offlineStorage.saveTodo(localTodo);
    return {
      success: true,
      data: localTodo
    };
  } catch (error) {
    // 保存到本地
    const localTodo = {
      ...todo,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await offlineStorage.saveTodo(localTodo);
    return {
      success: true,
      data: localTodo
    };
  }
};

// 更新任务
export const updateTodo = async (todo) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await http.patch(`/todos/${todo.id}`, todo);
      if (response.success) {
        await offlineStorage.saveTodo(response.data);
        return response;
      }
    }
    await offlineStorage.saveTodo(todo);
    return {
      success: true,
      data: todo
    };
  } catch (error) {
    await offlineStorage.saveTodo(todo);
    return {
      success: true,
      data: todo
    };
  }
};

// 删除任务
export const removeTodo = async (id) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await http.delete(`/todos/${id}`);
      if (response.success) {
        await offlineStorage.deleteTodo(id);
        return response;
      }
    }
    await offlineStorage.deleteTodo(id);
    return {
      success: true
    };
  } catch (error) {
    await offlineStorage.deleteTodo(id);
    return {
      success: true
    };
  }
};

// 获取任务统计信息
export const getTodoStats = () => {
  return http.get('/todos/stats');
};

// 更新番茄钟完成数
export const updateTodoPomodoros = (id) => {
  return http.patch(`/todos/${id}/pomodoros`);
};