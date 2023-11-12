import useStore from "../store";
import { trpc } from "../utils/trpc";

export const useMutateTask = () => {
  const utils = trpc.useContext();
  // ストアの入力値をリセットするメソッド
  const reset = useStore((state) => state.resetEditedTask);

  const createTaskMutation = trpc.todo.createTask.useMutation({
    onSuccess: (res) => {
      const previousTodos = utils.todo.getTasks.getData(); // 既存データを取得
      if (previousTodos) {
        // 先頭にデータを追加してから更新
        utils.todo.getTasks.setData(undefined, [res, ...previousTodos]);
      }
      reset();
    },
  });

  const updateTaskMutation = trpc.todo.updateTask.useMutation({
    onSuccess: (res) => {
      const previousTodos = utils.todo.getTasks.getData(); // 既存データを取得
      if (previousTodos) {
        // 対象のデータを更新する
        utils.todo.getTasks.setData(
          undefined,
          previousTodos.map((task) => (task.id === res.id ? res : task))
        );
      }
      reset();
    },
  });

  const deleteTaskMutation = trpc.todo.deleteTask.useMutation({
    onSuccess: (_, variables) => {
      const previousTodos = utils.todo.getTasks.getData(); // 既存データを取得
      if (previousTodos) {
        // 対象のデータを除外する
        utils.todo.getTasks.setData(
          undefined,
          previousTodos.filter((task) => task.id !== variables.taskId)
        );
      }
      reset();
    },
  });

  return { createTaskMutation, updateTaskMutation, deleteTaskMutation };
};
