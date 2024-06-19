export function createParams(obj: {
  [key: string]: string | number | null | undefined;
}) {
  return (
    "?" +
    Object.entries(obj)
      .filter(([_, val]) => val != null && val != undefined)
      .map(([key, val]) => `${key}=${val}`)
      .join("&")
  );
}
