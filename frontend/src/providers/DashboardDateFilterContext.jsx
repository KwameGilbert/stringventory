import { createContext, useContext, useMemo, useState } from "react";

const DashboardDateFilterContext = createContext(null);

const toISODate = (date) => date.toISOString().split("T")[0];

const getPresetDates = (preset) => {
  const now = new Date();
  const endDate = new Date(now);
  const startDate = new Date(now);

  switch (preset) {
    case "today":
      break;
    case "7days":
      startDate.setDate(now.getDate() - 6);
      break;
    case "30days":
      startDate.setDate(now.getDate() - 29);
      break;
    case "90days":
      startDate.setDate(now.getDate() - 89);
      break;
    case "year":
      startDate.setMonth(0, 1);
      break;
    default:
      startDate.setDate(now.getDate() - 29);
      break;
  }

  return {
    startDate: toISODate(startDate),
    endDate: toISODate(endDate),
  };
};

export const DashboardDateFilterProvider = ({ children }) => {
  const [filter, setFilter] = useState({
    type: "preset",
    preset: "30days",
    ...getPresetDates("30days"),
  });

  const setPreset = (preset) => {
    setFilter({
      type: "preset",
      preset,
      ...getPresetDates(preset),
    });
  };

  const setCustomRange = (startDate, endDate) => {
    setFilter((prev) => ({
      ...prev,
      type: "custom",
      startDate: startDate || prev.startDate,
      endDate: endDate || prev.endDate,
    }));
  };

  const value = useMemo(
    () => ({
      filter,
      setPreset,
      setCustomRange,
    }),
    [filter]
  );

  return (
    <DashboardDateFilterContext.Provider value={value}>
      {children}
    </DashboardDateFilterContext.Provider>
  );
};

export const useDashboardDateFilter = () => {
  const context = useContext(DashboardDateFilterContext);
  if (!context) {
    throw new Error("useDashboardDateFilter must be used within DashboardDateFilterProvider");
  }
  return context;
};
