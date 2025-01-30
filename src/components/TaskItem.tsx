// components/TaskItem.tsx
import React, { useEffect, useState } from "react";
import { Timer, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Task, { TaskStatus } from "../classes/Task";
import { formatTime } from "../utils/formatTime";
import { getTaskById, updateTask } from "@/service/apiService";

interface TaskItemProps {
  taskId: number;
  deleteTask?: (taskId: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ taskId, deleteTask }) => {
  const [task, setTask] = useState<Task>(new Task());
  // delete to be implemented

  // Load task upon component mount
  useEffect(() => {
    getTaskById(taskId).then((task: Task) => {
      setTask(task);
    });
  }, [taskId]);

  // Save and update task once it changes
  useEffect(() => {
    // save task
    updateTask(task);
  }, [task]);

  // Timing the task if running
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (
        task?.status === TaskStatus.Tracking ||
        task?.status === TaskStatus.Overrun
      ) {
        const startTime = task.startTime || now;
        const timeUsedInSeconds = Math.floor((now - startTime) / 1000);
        if (task.timeLimitInSeconds - timeUsedInSeconds <= 0) {
          task.status = TaskStatus.Overrun;
        }

        setTask((prevTask) => {
          if (!prevTask) return prevTask;
          return new Task(
            prevTask.id,
            prevTask.title,
            prevTask.timeLimitInSeconds,
            timeUsedInSeconds,
            prevTask.status,
            prevTask.startTime,
            prevTask.date,
            prevTask.completionTimes
          );
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [task]);

  const startTask = () => {
    setTask((prevTask) => {
      if (!prevTask) return prevTask;
      return prevTask.start();
    });
  };

  const completeTask = () => {
    setTask((prevTask) => {
      if (!prevTask) return prevTask;
      return prevTask.complete();
    });
  };

  const getStatusStyles = () => {
    switch (task.status) {
      case TaskStatus.Completed:
        return "bg-green-50";
      case TaskStatus.Failed || TaskStatus.Overrun:
        return "bg-red-50";
      default:
        return "";
    }
  };

  const renderStatusIcon = () => {
    switch (task.status) {
      case TaskStatus.Completed:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case TaskStatus.Failed:
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const renderTimings = () => {
    if (task?.status !== TaskStatus.Pending) {
      // Rendering for everything but pending
      return `Time used: ${formatTime(task.timeUsedInSeconds)}`;
    }
  };

  const renderActionButtons = () => {
    if (task.status === TaskStatus.Pending) {
      return (
        <>
          <Button
            onClick={() => startTask()}
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
    } else if (
      task.status === TaskStatus.Tracking ||
      task.status === TaskStatus.Overrun
    ) {
      return (
        <Button
          onClick={() => completeTask()}
          className="flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> Complete
        </Button>
      );
    }

    return null;
  };

  return (
    <div
      className={`flex items-center justify-between p-4 border rounded-lg ${getStatusStyles()}`}
    >
      <div className="flex-grow">
        <div className="font-medium flex items-center gap-2">
          {task.title}
          {renderStatusIcon()}
        </div>
        <div className="text-sm text-gray-500">
          {/* Time remaining: {formatTime(task.timeRemaining)} */}
          {renderTimings()}
          {"Time limit: " + formatTime(task.timeLimitInSeconds)}
          {task.getAverageTime() && (
            <span className="ml-2">(Avg: {formatTime(task.getAverageTime())})</span>
          )}
        </div>
      </div>
      <div className="flex gap-2">{renderActionButtons()}</div>
    </div>
  );
};

export default TaskItem;
