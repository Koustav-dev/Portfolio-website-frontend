const BASE = import.meta.env.VITE_API_URL;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Something went wrong");
  return json.data;
}

export const api = {
  // ── Public ──────────────────────────────────────────────────
  getProjects: (category?: string, limit = 20) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    params.set("limit", String(limit));
    return request(`/projects?${params.toString()}`);
  },

  getProject:    (slug: string) =>
    request(`/projects/${slug}`),

  getExperience: () =>
    request("/experience"),

  getSkills:     () =>
    request("/skills"),

  getConfig:     (key: "hero" | "about" | "social" | "resume") =>
    request(`/config/${key}`),

  sendContact:   (body: { name: string; email: string; message: string }) =>
    request("/contact", { method: "POST", body: JSON.stringify(body) }),

  // ── Admin ────────────────────────────────────────────────────
  login: (email: string, password: string) =>
    request("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};