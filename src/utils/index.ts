export function createSlug(title: string): string {
  return title.toLowerCase().replaceAll(" ", "_");
}

export function getTime(date: Date) {
  const str = date.toLocaleTimeString();
  return str.substring(0, 5) + " " + str.substring(9, 11);
}
