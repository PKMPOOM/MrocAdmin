export type ReplaceSpacesWithUnderscores<T extends string> =
  T extends `${infer L} ${infer R}`
    ? `${Lowercase<L>}_${ReplaceSpacesWithUnderscores<R>}`
    : Lowercase<T>;

export type StrictSelectTypes<
  T extends string,
  K extends string | undefined = undefined,
> = {
  value: ReplaceSpacesWithUnderscores<T>;
  label: K extends string ? K : T;
}[];

export const formattedUppercase = (input: string) => {
  return (
    input.charAt(0).toUpperCase() +
    input.slice(1).toLowerCase().replaceAll("_", " ")
  );
};

export type CapitalizeFirst<T extends string> =
  T extends `${infer L}_${infer R}`
    ? `${Capitalize<Lowercase<L>>} ${CapitalizeFirst<R>}`
    : Capitalize<Lowercase<T>>;

export type SettingsList<T> = {
  label: CapitalizeFirst<Extract<keyof T, string>>;
  name: ReplaceSpacesWithUnderscores<Extract<keyof T, string>>;
  value: T[Extract<keyof T, string>];
};
