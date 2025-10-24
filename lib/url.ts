export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser can use relative
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const port = process.env.PORT || 3000;
  return `http://localhost:${port}`;
}
