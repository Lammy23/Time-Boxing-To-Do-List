import { SearchProvider } from "@/context/searchContext";
import TaskTimerApp from "../components/TaskTimerApp";

export default function Home() {
  return (
    <>
      <SearchProvider>
        <TaskTimerApp />
      </SearchProvider>
    </>
  );
}
