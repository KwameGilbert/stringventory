import { BASE_URL } from "../services/api.endpoints";

const API_ORIGIN = (() => {
  try {
    return new URL(BASE_URL).origin;
  } catch {
    return "";
  }
})();

export const resolveApiMediaUrl = (value) => {
  if (!value || typeof value !== "string") return null;
  if (value.startsWith("data:")) return value;

  try {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      const absoluteUrl = new URL(value);

      if ((absoluteUrl.hostname === "localhost" || absoluteUrl.hostname === "127.0.0.1") && API_ORIGIN) {
        return `${API_ORIGIN}${absoluteUrl.pathname}`;
      }

      return value;
    }

    if (!API_ORIGIN) return value;

    const normalizedPath = value.startsWith("/") ? value : `/${value}`;
    return `${API_ORIGIN}${normalizedPath}`;
  } catch {
    return value;
  }
};
