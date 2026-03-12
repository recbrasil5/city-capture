import type { City } from "@/types";

export async function loadAllCities(): Promise<City[]> {
  const modules = import.meta.glob("@/data/cities-by-country/*.json", {
    eager: true,
  });

  const all: City[] = [];

  for (const path in modules) {
    const mod = modules[path] as any;
    const data = Array.isArray(mod) ? mod : mod.default;

    if (Array.isArray(data)) {
      all.push(...data);
    }
  }

  return all;
}