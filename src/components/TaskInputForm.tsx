// components/TaskInputForm.tsx
import React, { useState, useEffect, useContext } from "react";
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatTime } from "../utils/formatTime";
import { addTask, getTasks, getTasksByKeyword } from "@/service/apiService";
import Task, { TaskStatus } from "@/classes/Task";
import { formatDate } from "date-fns";
import { localTz } from "@/utils/formatDate";
import { TaskListContext } from "@/contexts/TaskListContext";

// interface Suggestion {
//   title: string;
//   averageTime: number;
//   completionCount: number;
// }

const TaskInputForm: React.FC = () => {
  const [taskSuggestions, setTaskSuggestions] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false); // Show suggestions when user types

  const { refreshTaskList } = useContext(TaskListContext);

  // Once the user starts typing (once newTaskTitle.length changes), fetch the updated
  // tasks from the api every 5 seconds 10 times, then stop if no activity
  // TODO: Possible optimization -> shift pagination and filtering to backend to reduce data transfer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let count = 0;

    if (newTaskTitle.length > 1) {
      interval = setInterval(() => {
        getTasks().then((tasks: Task[]) => {
          setTaskSuggestions(tasks);
        });
        count++;
        if (count >= 10) {
          clearInterval(interval);
        }
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [newTaskTitle]);

  // Update suggestions as user types
  useEffect(() => {
    if (newTaskTitle.length > 1) {
      // Set suggestions using a search
      getTasksByKeyword(newTaskTitle).then((tasks: Task[]) => {
        setTaskSuggestions(tasks);
        setShowSuggestions(tasks.length > 0);
      });
    } else {
      setTaskSuggestions([]);
      setShowSuggestions(false);
    }
  }, [newTaskTitle, taskSuggestions]);

  const selectSuggestion = (taskSuggestion: Task) => {
    setNewTaskTitle(taskSuggestion.title);
    const avgTimeInSeconds = taskSuggestion.getAverageTime();
    setHours(Math.floor(avgTimeInSeconds / 3600).toString());
    setMinutes(Math.floor((avgTimeInSeconds % 3600) / 60).toString());
    setSeconds((avgTimeInSeconds % 60).toString());
    setShowSuggestions(false);
  };

  // If user clicks outside the suggestions, hide them
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && !e.target.closest(".relative")) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleAddTask = () => {
    if (newTaskTitle && (hours || minutes || seconds)) {
      const timeInSeconds =
        parseInt(hours || "0") * 3600 +
        parseInt(minutes || "0") * 60 +
        parseInt(seconds || "0");

      addTaskAndRefreshTaskList(newTaskTitle, timeInSeconds);
      setNewTaskTitle("");
      setHours("");
      setMinutes("");
      setSeconds("");
    }
  };

  const addTaskAndRefreshTaskList = (title: string, timeInSeconds: number) => {
    const newTask: Task = new Task(
      Date.now(),
      title,
      timeInSeconds,
      0,
      TaskStatus.Pending,
      null,
      formatDate(Date.now(), localTz),
      []
    );

    addTask(newTask); // Add task to backend
    refreshTaskList(); // Refresh task list
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Input
          placeholder="New task"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="w-full"
        />
        {showSuggestions && (
          <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1">
            {taskSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => selectSuggestion(suggestion)}
              >
                <div>{suggestion.title}</div>
                <div className="text-sm text-gray-500">
                  Avg: {formatTime(suggestion.getAverageTime())} | Completed:{" "}
                  {suggestion.getCompletionCount()} times
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Hours"
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="w-24"
        />
        <Input
          placeholder="Minutes"
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          className="w-24"
        />
        <Input
          placeholder="Seconds"
          type="number"
          value={seconds}
          onChange={(e) => setSeconds(e.target.value)}
          className="w-24"
        />
        <Button onClick={handleAddTask} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Add
        </Button>
      </div>
    </div>
  );
};

export default TaskInputForm;
