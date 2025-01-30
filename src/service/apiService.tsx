import DailyStat, { DailyStatJSON } from "@/classes/DailyStat";
import Task, { TaskJSON } from "@/classes/Task";
import axios, { AxiosResponse } from "axios";
const API = `https://67994b76be2191d708b28c33.mockapi.io/todoapi`;
const DEBUG = 1; // Debug flag

interface DebugParameters {
  status?: number;
  statusText?: string;
  data?: TaskJSON | DailyStatJSON | TaskJSON[] | DailyStatJSON[];
  name?: string;
  code?: string;
  message?: string;
  response?: AxiosResponse;
}

// DEBUG
const printDebug = (f: string, parameters: DebugParameters) => {
  // TODO: Fix this later
  if (DEBUG) {
    const withError = parameters["name"]; // Checking if parameters or for a .catch block or a .then block
    if (!withError) {
      const { status, statusText, data } = parameters;
      console.log(`Name: ${f}`);
      console.log("Status & Text: ", status, statusText);
      console.log("Data: ", data);
    } else {
      const { name, code, message, response } = parameters;
      console.error(`Name: ${f} `, name);
      console.error("Code: ", code);
      console.error("Message: ", message);
      console.error("Status & Text: ", response?.status, response?.statusText);
    }
  }
};

/**
 * Returns a list of Task objects
 */
export const getTasks = (): Promise<Task[]> => {
  return axios
    .get(`${API}/Task`)
    .then(({ status, statusText, data }) => {
      printDebug("getTasks", { status, statusText, data });
      return data.map(
        (task: TaskJSON) =>
          new Task(
            task.id,
            task.title,
            task.timeLimitInSeconds,
            task.timeUsedInSeconds,
            task.status,
            task.startTime,
            task.date,
            task.completionTimes
          )
      );
    })
    .catch(({ name, code, message, response }) => {
      printDebug("getTasks", { name, code, message, response });
      return [];
    });
}; // TESTED

// Get Tasks that match the keyword for searching (manual filtering required)
export const getTasksByKeyword = (keyword: string): Promise<Task[]> => {
  return getTasks().then((tasks) => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(keyword.toLowerCase())
    );
  });
};

export const updateTasks = (tasks: Task[]) => {
  tasks.forEach((task) => {
    updateTask(task);
  });
};

/**
 * Returns a Task object with the given taskId
 * @param taskId Task ID
 */
export const getTaskById = (taskId: number): Promise<Task> => {
  return axios
    .get(`${API}/Task/${taskId}`)
    .then(({ status, statusText, data }) => {
      printDebug("getTask", { status, statusText, data });
      return new Task(
        data.id,
        data.title,
        data.timeLimitInSeconds,
        data.timeUsedInSeconds,
        data.status,
        data.startTime,
        data.date,
        data.completionTimes
      );
    })
    .catch(({ name, code, message, response }) => {
      printDebug("getTask", { name, code, message, response });
      return new Task(); //TODO: Make an error task object
    });
}; // TESTED

/**
 * Adds a new Task object
 * @param task Task object
 */
export const addTask = (task: Task): Promise<void> => {
  const jsonTask = {
    title: task.title,
    startTime: task.startTime,
    timeLimitInSeconds: task.timeLimitInSeconds,
    timeUsedInSeconds: task.timeUsedInSeconds,
    status: task.status,
    date: task.date,
    completionTimes: task.completionTimes,
  };
  return axios
    .post(`${API}/Task`, jsonTask)
    .then(({ status, statusText, data }) => {
      printDebug("addTask", { status, statusText, data });
    })
    .catch(({ name, code, message, response }) => {
      printDebug("addTask", { name, code, message, response });
    });
};

/**
 * Updates a Task object
 * @param task Task object
 */
export const updateTask = (task: Task): Promise<void> => {
  const jsonTask = {
    title: task.title,
    startTime: task.startTime,
    timeLimitInSeconds: task.timeLimitInSeconds,
    timeUsedInSeconds: task.timeUsedInSeconds,
    status: task.status,
    date: task.date,
    completionTimes: task.completionTimes,
  };
  return axios
    .put(`${API}/Task/${task.id}`, jsonTask)
    .then(({ status, statusText, data }) => {
      printDebug("updateTask", { status, statusText, data });
    })
    .catch(({ name, code, message, response }) => {
      printDebug("updateTask", { name, code, message, response });
    });
};

/**
 * Updates the name of a Task object
 * @param taskId Task ID
 * @param newTitle New Task Name
 */
export const updateTaskName = (
  taskId: number,
  newTitle: string
): Promise<void> => {
  return getTaskById(taskId).then((task) => {
    task.title = newTitle;
    updateTask(task);
  });
};

/**
 * Deletes a Task object
 * @param taskId Task ID
 */
export const deleteTask = (taskId: number): Promise<void> => {
  return axios
    .delete(`${API}/Task/${taskId}`)
    .then(({ status, statusText, data }) => {
      printDebug("deleteTask", { status, statusText, data });
    })
    .catch(({ name, code, message, response }) => {
      printDebug("deleteTask", { name, code, message, response });
    });
};

export const getDailyStats = (): Promise<DailyStat[]> => {
  return axios
    .get(`${API}/DailyStat`)
    .then(({ status, statusText, data }) => {
      printDebug("getDailyStats", { status, statusText, data });
      return data.map(
        (stat: DailyStatJSON) =>
          new DailyStat(
            stat.date,
            stat.score,
            stat.completionRate,
            stat.totalAttempts
          )
      );
    })
    .catch(({ name, code, message, response }) => {
      printDebug("getDailyStats", { name, code, message, response });
      return [];
    });
};

export const getDailyStatbyDate = (date: string): Promise<DailyStat> => {
  return axios
    .get(`${API}/DailyStat/${date}`)
    .then(({ status, statusText, data }) => {
      printDebug("getDailyStatbyDate", { status, statusText, data });
      return new DailyStat(
        data.date,
        data.score,
        data.completionRate,
        data.totalAttempts
      );
    })
    .catch(({ name, code, message, response }) => {
      printDebug("getDailyStatbyDate", { name, code, message, response });
      return new DailyStat();
    });
};
