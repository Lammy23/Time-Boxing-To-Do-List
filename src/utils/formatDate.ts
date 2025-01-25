import { formatInTimeZone } from "date-fns-tz"; // TODO: npm install

export const formatDate = (date: number, timezone: string) => {
  return formatInTimeZone(date, timezone, "yyyy-MM-dd");
};

export const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
