import { TodoistApi } from "@doist/todoist-api-typescript";

// NOTE: We need to have NEXT_PUBLIC preceeding the actual name of the env variable
const todoistApiKey = process.env.NEXT_PUBLIC_TODOIST_API_KEY;
const goodTasksLabel = "well_defined";

// Ensure that API key exists
if (!todoistApiKey) {
  throw new Error("Missing Todoist env variable");
}

const api = new TodoistApi(todoistApiKey);

/**
 * Function to get all tasks due today or overdue that are also well-defined (graded)
 * @returns The list of tasks
 */
async function getTasksTodayOrOverdue() {
  //#TODO: Ensure that future version of this program can grab more than 50 tasks at a time

  // Fine tuning parameters

  try {
    const { results } = await api.getTasks();
    return console.log(results);
  } catch (error) {
    return console.log(error);
  }
}

export { getTasksTodayOrOverdue };
