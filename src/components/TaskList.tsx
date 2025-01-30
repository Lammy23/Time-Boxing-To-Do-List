// components/TaskList.tsx
import React, { useContext, useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import { TaskListContext } from "@/contexts/TaskListContext";

// interface TaskListProps {
//   tasks: Task[];
//   taskHistory: TaskHistory;
//   actions: TaskActions;
// }

const TaskList: React.FC = () => {
  const [todaysTaskIds, setTodaysTaskIds] = useState<number[]>([]);
  const { refreshTaskList } = useContext(TaskListContext);
  // Load tasks upon component mount
  useEffect(() => {
    refreshTaskList();
  }, [refreshTaskList]);

  const deleteTask = (id: number) => {
    setTodaysTaskIds((prevIds) => prevIds.filter((taskId) => taskId !== id));
  };
  return (
    <div className="space-y-4">
      {todaysTaskIds.map((taskId) => (
        <TaskItem key={taskId} taskId={taskId} deleteTask={deleteTask} />
      ))}
    </div>
  );
};

export default TaskList;
