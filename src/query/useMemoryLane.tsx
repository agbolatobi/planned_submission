import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CreateMemoryLaneParams, 
  ShareMemoryLaneParams, 
  UpdateMemoryLaneViewParams 
} from "../typings";
import { API_URL } from "../config";

export const useCreateMemoryLane = () => {
  return useMutation({
    mutationFn: async (params: CreateMemoryLaneParams) => {
      const response = await fetch(`${API_URL}/memory_lane`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new Error('Failed to create memory lane');
      }
      return response.json();
    },
  });
};

export const useShareMemoryLane = () => {
  return useMutation({
    mutationFn: async (params: ShareMemoryLaneParams) => {
      const response = await fetch(`${API_URL}/memory_lane_share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new Error('Failed to share memory lane');
      }
      return response.json();
    },
  });
};

export const useUpdateMemoryLaneView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateMemoryLaneViewParams) => {
      const response = await fetch(`${API_URL}/memory_lane_share/view/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ has_viewed: params.has_viewed }),
      });
      if (!response.ok) {
        throw new Error('Failed to update memory lane view');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared_memory_lanes'] });
    },
  });
}; 