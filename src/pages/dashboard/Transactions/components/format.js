// Small formatting helpers shared by the transaction detail page and its panels.

export const titleize = (value) =>
  value ? String(value).replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()) : "—";

export const formatDate = (value, withTime = false) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(
    "en-US",
    withTime
      ? { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
      : { year: "numeric", month: "short", day: "numeric" }
  );
};

export const personName = (person) =>
  person ? [person.firstName, person.lastName].filter(Boolean).join(" ").trim() || null : null;
