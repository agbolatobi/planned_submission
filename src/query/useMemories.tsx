import { useMutation, useQuery } from "@tanstack/react-query";
import { Memory, GetMemoriesParams } from "../typings";
import { API_URL } from "../config";

export const useGetMemories = (params: GetMemoriesParams) => {
  return useQuery({
    queryKey: ["memories", params.memoryLaneId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/memories/${params.memoryLaneId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch memories');
      }
      return response.json();
    },
  });
};

export const useCreateMemory = () => {
  return useMutation({
    mutationFn: async (params: Memory) => {
      const formData = new FormData();
      formData.append('name', params.name);
      formData.append('description', params.description);
      formData.append('timestamp', params.timestamp);
      formData.append('memory_lane_id', params.memory_lane_id.toString());
      if (params.file) {
        formData.append('file', params.file);
      }

      const response = await fetch(`${API_URL}/memories`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to create memory');
      }
      return response.json();
    },
  });
};

export const useUpdateMemory = () => {
  return useMutation({
    mutationFn: async ({ id, ...params }: Memory & { id: number }) => {
      const response = await fetch(`${API_URL}/memories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new Error('Failed to update memory');
      }
      return response.json();
    },
  });
};

export const useDeleteMemory = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_URL}/memories/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete memory');
      }
      return response.json();
    },
  });
}; 