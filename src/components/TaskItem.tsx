// components/TaskItem.tsx
import React from 'react';
import { Timer, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Task, TaskActions } from '../types';
import { formatTime } from '../utils/formatTime';

interface TaskItemProps {
  task: Task;
  averageTime?: number;
  actions: TaskActions;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  averageTime, 
  actions 
}) => {
  const { startTask, completeTask, rescheduleTask, deleteTask } = actions;

  const getStatusStyles = () => {
    switch (task.status) {
      case 'completed':
        return 'bg-green-50';
      case 'failed':
        return 'bg-red-50';
      default:
        return '';
    }
  };

  const renderStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const handleReschedule = (taskId: number) => {
    rescheduleTask(taskId);
  };

  const renderActionButtons = () => {
    if (task.status === 'pending' && !task.active) {
      return (
        <>
          <Button 
            onClick={() => startTask(task.id)} 
            className="flex items-center gap-2"
          >
            <Timer className="w-4 h-4" /> Start
          </Button>
          {deleteTask && (
            <Button 
              variant="destructive" 
              onClick={() => deleteTask(task.id)} 
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          )}
        </>
      );
    }

    if (task.status === 'pending' && task.active) {
      return (
        <Button 
          onClick={() => completeTask(task.id)} 
          className="flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> Complete
        </Button>
      );
    }

    if (task.status === 'failed' && !task.hasBeenRescheduled) {
      return (
        <Button 
          onClick={() => handleReschedule(task.id)} 
          className="flex items-center gap-2"
        >
          <Timer className="w-4 h-4" /> Reschedule (2x)
        </Button>
      );
    }

    return null;
  };

  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg ${getStatusStyles()}`}>
      <div className="flex-grow">
        <div className="font-medium flex items-center gap-2">
          {task.title}
          {renderStatusIcon()}
        </div>
        <div className="text-sm text-gray-500">
          Time remaining: {formatTime(task.timeRemaining)}
          {averageTime && (
            <span className="ml-2">
              (Avg: {formatTime(averageTime)})
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        {renderActionButtons()}
      </div>
    </div>
  );
};

export default TaskItem;