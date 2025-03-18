import { useQuery } from "@tanstack/react-query";
import { GetMemoryLanesParams } from "../typings";
import { API_URL } from "../config";

export const useGetMemoryLanes = (params: GetMemoryLanesParams) => {
  return useQuery({
    queryKey: ["memoryLanes", params.userId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/memory_lane/${params.userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch memory lanes');
      }
      return response.json();
    },
  });
}; 