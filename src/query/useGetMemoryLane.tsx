import { useQuery } from '@tanstack/react-query'
import { GetMemoryLaneParams, GetMemoryLaneResponse } from '../typings'
import { API_URL } from '../config'

export const useGetMemoryLane = (params: GetMemoryLaneParams) => {
  return useQuery<GetMemoryLaneResponse>({
    queryKey: ['memory_lane', params.id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/memory_lane/share/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch memory lane')
      }
      return response.json()
    },
    enabled: !!params.id, // Only run the query if we have an ID
  })
} 