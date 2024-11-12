// components/TaskList.tsx
import React from 'react';
import TaskItem from './TaskItem';
import { Task, TaskActions, TaskHistory } from '../types';

interface TaskListProps {
  tasks: Task[];
  taskHistory: TaskHistory;
  actions: TaskActions;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, taskHistory, actions }) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          averageTime={taskHistory[task.title]?.averageTime}
          actions={actions}
        />
      ))}
    </div>
  );
};

export default TaskList;