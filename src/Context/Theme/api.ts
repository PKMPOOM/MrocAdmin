import useSWR from "swr";
import { TthemeData } from "../../Store/useTheme";

export const getTheme = (AuthUser: any) => {
  const shouldFetch = AuthUser !== null;

  return useSWR<{
    code: number;
    data: TthemeData;
  }>(() => (shouldFetch ? `/style/current` : null));
};

//  const shouldFetch = id !== undefined;
// return useSWR<Scales>(() => (shouldFetch ? `/scales/${id}` : null));
