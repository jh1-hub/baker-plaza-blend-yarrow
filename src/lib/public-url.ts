/** Vite `base` (always trailing slash). Safe for GitHub project Pages and Vercel. */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}${path.replace(/^\//, "")}`;
}

export function routerBasepath(): string {
  const raw = import.meta.env.BASE_URL || "/";
  if (raw === "/") return "/";
  return raw.replace(/\/$/, "") || "/";
}
