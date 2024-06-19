export const urlBuilder = (url: string) => {
  // Add "www." if it doesn't start with it
  if (!url.startsWith("www.")) {
    url = "www." + url;
  }

  // Add "http://" if it doesn't start with either "http://" or "https://"
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "http://" + url;
  }

  // Remove trailing "/" if it exists
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }

  return url;
};
