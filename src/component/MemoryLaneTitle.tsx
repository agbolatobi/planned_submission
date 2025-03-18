import { Typography, Skeleton } from '@mui/material'
import { useGetMemoryLane } from '../query/useGetMemoryLane'

interface MemoryLaneTitleProps {
  memoryLaneId: number
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export default function MemoryLaneTitle({ 
  memoryLaneId, 
  variant = 'h6' 
}: MemoryLaneTitleProps) {
  const { data: memoryLaneData, isLoading, error } = useGetMemoryLane({ id: memoryLaneId })

  if (isLoading) {
    return <Skeleton width={200} />
  }
  console.log("memoryLaneData", memoryLaneData)
  if (error || !memoryLaneData?.memory_lane) {
    return (
      <Typography variant={variant} color="error">
        Memory Lane Not Found
      </Typography>
    )
  }

  return (
    <Typography variant={variant}>
      {memoryLaneData.memory_lane.name}
    </Typography>
  )
} 