export const RESOURCE_GUIDE_API_URL = import.meta.env.VITE_RESOURCE_GUIDE_API_URL
  || "https://shaynemcgregordev-be.netlify.app/.netlify/functions/resource-guide-data";

const CACHE_KEY = "resourceGuideDataCache";

export function getResourceCategories(resources) {
  return [...new Set(resources.map((resource) => resource.category).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right));
}

export function filterResourcesByCategory(resources, category) {
  return category === "All" ? resources : resources.filter((resource) => resource.category === category);
}

export async function loadResourceGuide(fetcher = fetch) {
  try {
    const response = await fetcher(RESOURCE_GUIDE_API_URL, { cache: "no-store" });
    if (!response.ok) throw new Error(`Resource Guide request failed with status ${response.status}`);
    const data = await response.json();
    if (!isResourceGuideResponse(data)) throw new Error("Resource Guide response is invalid.");
    writeCachedGuide(data, response.headers.get("etag") || "");
    return { data, source: "network" };
  } catch (error) {
    const cached = readCachedGuide();
    if (cached) return { data: cached, source: "cache" };
    throw error;
  }
}

function isResourceGuideResponse(value) {
  return value
    && typeof value === "object"
    && Array.isArray(value.resources)
    && typeof value.generatedAt === "string"
    && value.resources.every(isResource);
}

function isResource(value) {
  return value
    && typeof value === "object"
    && typeof value.id === "string"
    && typeof value.title === "string"
    && typeof value.url === "string"
    && typeof value.category === "string"
    && typeof value.dateAdded === "string"
    && ["disciplines", "researchStages", "aiRoles", "tags"].every((key) => Array.isArray(value[key]));
}

function readCachedGuide() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isResourceGuideResponse(parsed?.data) ? parsed.data : null;
  } catch {
    return null;
  }
}

function writeCachedGuide(data, etag) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ etag, data }));
  } catch {
    // The guide remains usable when browser storage is unavailable.
  }
}
