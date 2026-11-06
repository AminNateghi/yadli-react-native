import { useEffect, useState } from "react";

export function useToday(): Date {
  const [today, setToday] = useState(() => new Date());

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const updateAtMidnight = () => {
      const now = new Date();
      const nextDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );
      timeout = setTimeout(() => {
        setToday(new Date());
        updateAtMidnight();
      }, nextDay.getTime() - now.getTime());
    };

    updateAtMidnight();
    return () => clearTimeout(timeout);
  }, []);

  return today;
}
