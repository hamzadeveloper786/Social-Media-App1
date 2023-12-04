const isLocal = window.location.href.includes("localhost");

export const baseURL = isLocal ? "http://localhost:3001" : "";