export function createSlug(title: string): string {
  return title.toLowerCase().replaceAll(" ", "_");
}
