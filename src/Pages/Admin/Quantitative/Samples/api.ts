import useSWR from "swr";
import { fetchDELETE, fetchPOST, fetchPUT } from "../../../../Utils/fetchUtils";
import { RuleGroupType, RuleGroupTypeIC, RuleType } from "react-querybuilder";

export type Sample = {
  id: string;
  key: number;
  SampleName: string;
  SampleNotes?: string | null;
  Parameters: string;
  QuestionIDs: string;
  Exclusion: string[];
  SampleScript?: string | null;
  isactive: boolean;
  Frozen: boolean;
  FrozenBy?: string | null;
  FrozenFor?: number | null;
  TimeStamp: Date;
  json: string;
  surveyCols?: string | null;
  quotaFull: number;
  SampleSize: number;
  tags?: string[];
  CharityIncluded: string[];
};

export type FormSchema = {
  name: string;
  size: number;
  notes: string;
  selected_charity: string[];
};

export type queryType =
  | RuleGroupType<RuleType<string, string, any, string>, string>
  | RuleGroupTypeIC<RuleType<string, string, any, string>, string>;

export type Payload = {
  json: object;
  Parameters: string;
} & FormSchema;

export type ExternalSample = {
  id: string;
  key: number;
  SampleName: string;
  Url: string;
  APIKey: string;
  TimeStamp: Date;
};

export const getsampleList = () => {
  return useSWR<Sample[]>(`/samples/list`);
};

export const getSampleData = (id: string | undefined) => {
  const shouldFetch = id !== "New" && id !== undefined;
  return useSWR<Sample>(() => (shouldFetch ? `/samples/${id}` : null));
};

export const useCreateNewSample = (data: any) => {
  return fetchPOST(`/samples`, data);
};

export const useUpdateSample = (id: string, data: any) => {
  return fetchPUT(`/samples/${id}`, data);
};

export const useDeleteMultiSamples = (data: any) => {
  return fetchDELETE(`/samples`, {
    data: {
      ids: data,
    },
  });
};

export const useUpdateSampleTags = (id: string, data: string[]) => {
  return fetchPUT(`/samples/${id}/tags`, {
    tagData: data,
  });
};

export const useGetThirdPartySampleList = () => {
  return useSWR<ExternalSample[]>(`/samples/thirdParty/list`);
};

export const useCreateThirdPartySample = (data: any) => {
  return fetchPOST(`/samples/thirdParty`, data);
};

export const useGetThirdPartySampleData = (id: string | undefined) => {
  const shouldFetch = id !== undefined;
  return useSWR<ExternalSample>(() =>
    shouldFetch ? `/samples/thirdParty/${id}` : null
  );
};

export const useUpdateThirdPartySample = (id: string, data: any) => {
  return fetchPUT(`/samples/thirdParty/${id}`, data);
};

export const useDeleteThirdPartySample = (id: string) => {
  return fetchDELETE(`/samples/thirdParty/${id}`);
};

export const useDeleteMultiThirdPartySamples = (data: any) => {
  return fetchDELETE(`/samples/thirdParty`, {
    data: {
      ids: data,
    },
  });
};
