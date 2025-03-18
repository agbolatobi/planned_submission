import { useQuery } from "@tanstack/react-query";
import { GetSharedMemoryLanesParams, SharedMemoryLaneResponse } from "../typings";
import { API_URL } from "../config";

export const useGetSharedMemoryLanes = (params: GetSharedMemoryLanesParams) => {
  return useQuery<{memory_lanes: SharedMemoryLaneResponse[]}>({
    queryKey: ["sharedMemoryLanes", params.userId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/memory_lane_share/${params.userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch shared memory lanes');
      }
      return response.json();
    },
  });
}; 