/** 获取todos */
export const getTodos = () => {
  return http.get(`/todos`, {
    params: {},
  });
};

// 写入todo
export const addTodo = (todo) => {
  return http.post(`/todos`, todo);
};

// 更新todo
export const updateTodo = (todo) => {
  return http.patch(`/todos/${todo.id}`, todo);
};