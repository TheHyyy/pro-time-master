/** 老师、学生加入课节 */
export const getTodos = (lessonId) => {
  return http.get(`/todos`, {
    params: {},
  });
};
