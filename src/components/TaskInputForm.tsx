// components/TaskInputForm.tsx
import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Suggestion, TaskHistory } from '../types';
import { formatTime } from '../utils/formatTime';

interface TaskInputFormProps {
  taskHistory: TaskHistory;
  onAddTask: (title: string, timeInSeconds: number) => void;
}

const TaskInputForm: React.FC<TaskInputFormProps> = ({
  taskHistory,
  onAddTask,
}) => {
  const [newTask, setNewTask] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Update suggestions as user types
  useEffect(() => {
    if (newTask.length > 1) {
      const matches = Object.keys(taskHistory)
        .filter((task) => task.toLowerCase().includes(newTask.toLowerCase()))
        .map((task) => ({
          title: task,
          averageTime: taskHistory[task].averageTime,
          completionCount: taskHistory[task].completionCount,
        }));
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [newTask, taskHistory]);

  const selectSuggestion = (suggestion: Suggestion) => {
    setNewTask(suggestion.title);
    const avgTimeInSeconds = suggestion.averageTime;
    setHours(Math.floor(avgTimeInSeconds / 3600).toString());
    setMinutes(Math.floor((avgTimeInSeconds % 3600) / 60).toString());
    setSeconds((avgTimeInSeconds % 60).toString());
    setShowSuggestions(false);
  };

  // If user clicks outside the suggestions, hide them
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLElement &&
        !e.target.closest('.relative')
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleAddTask = () => {
    if (newTask && (hours || minutes || seconds)) {
      const timeInSeconds =
        parseInt(hours || '0') * 3600 +
        parseInt(minutes || '0') * 60 +
        parseInt(seconds || '0');

      onAddTask(newTask, timeInSeconds);
      setNewTask('');
      setHours('');
      setMinutes('');
      setSeconds('');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Input
          placeholder="New task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="w-full"
        />
        {showSuggestions && (
          <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => selectSuggestion(suggestion)}
              >
                <div>{suggestion.title}</div>
                <div className="text-sm text-gray-500">
                  Avg: {formatTime(suggestion.averageTime)} | Completed:{' '}
                  {suggestion.completionCount} times
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