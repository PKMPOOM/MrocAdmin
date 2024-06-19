export const toSnakecase = (str: string) => {
  return str.toLocaleLowerCase().replaceAll(" ", "_");
};
