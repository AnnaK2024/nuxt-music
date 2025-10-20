export function normalizeId(id) {
  if (id === null || id === undefined) return null;
  const s = String(id).trim();
  return s === "" ? null : s;
}

export function extractYearFromReleaseDate(releaseDate) {
  if (!releaseDate) return "Неизвестно";
  const raw = String(releaseDate).split("<")[0].trim();
  const match = raw.match(/\d{4}/);
  return match ? match[0] : raw || "Неизвестно";
}

export function normalizeGenreName(genre) {
  if (!genre) return "неизвестно";
  return String(genre).toLowerCase().trim();
}

// Помощник — нормализовать трек и вернуть с валидным id
 export const normalizeTrack = (t, fallbackId = null, idx = 0) => {
    const rawId = t?.id || t?._id || t?.trackId || fallbackId || `__generated_${idx}`;
    const id = normalizeId(rawId) || `__generated_${idx}`;
    return { ...t, id };
  };

