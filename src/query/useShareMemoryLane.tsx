import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_URL } from '../config'

interface ShareMemoryLaneParams {
  user_id: number
  memory_lane_id: number
}

export const useShareMemoryLane = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: ShareMemoryLaneParams) => {
      const response = await fetch(`${API_URL}/memory_lane_share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
      if (!response.ok) {
        throw new Error('Failed to share memory lane')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared_memory_lanes'] })
    },
  })
} 