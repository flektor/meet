export function createSlug(title: string): string {
  return title.toLowerCase().replaceAll(" ", "_");
}

export function getTime(date: Date) {
  const str = date.toLocaleTimeString();
  const [time, period] = str.split(" ") as [string, string];
  const [hours, minutes] = time.split(":");
  return `${hours}:${minutes} ${period?.toLowerCase()}`;
}
