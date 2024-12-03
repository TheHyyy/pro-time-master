/** 获取todos */
export const fetchTodos = () => {
  return http.get(`/todos`, {
    params: {},
  });
};

// 写入todo
export const createTodo = (todo) => {
  return http.post(`/todos`, todo);
};

// 更新todo
export const updateTodo = (todo) => {
  return http.patch(`/todos/${todo.id}`, todo);
};

// 删除todo
export const removeTodo = (id) => {
  return http.delete(`/todos/${id}`);
};