import Task from "@/classes/Task";
import { getTasks } from "@/service/apiService";
import { localTz } from "@/utils/formatDate";
import { formatDate } from "date-fns";
import React, { createContext, ReactNode, useState, useEffect } from "react";

// Define the shape of the context
interface TaskListContextType {
    taskList: number[];
    refreshTaskList: () => void;
}

// Provide a default value for the context
const defaultContextValue: TaskListContextType = {
    taskList: [],
    refreshTaskList: () => {},
};

export const TaskListContext = createContext<TaskListContextType>(defaultContextValue);

export function TaskListProvider({ children }: { children: ReactNode }) {
    const [taskList, setTaskList] = useState<number[]>([]); // Where TaskList is just a list of today's task id's

    const refreshTaskList = () => {
        getTasks().then((tasks: Task[]) => {
            // Filter tasks for today
            const today = formatDate(Date.now(), localTz);
            const taskIds = tasks
                .filter((task) => task.date === today)
                .map((task) => task.id);
            setTaskList(taskIds);
        });
    };

    // Optionally, refresh the task list when the component mounts
    useEffect(() => {
        refreshTaskList();
    }, []);

    return (
        <TaskListContext.Provider
            value={{
                taskList,
                refreshTaskList,
            }}
        >
            {children}
        </TaskListContext.Provider>
    );
}
