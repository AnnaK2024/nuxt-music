export function formatTime(seconds) {
  // Проверяем, что передан аргумент и что это число
  if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
    return "";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}