import { useState } from 'react'
import { useGetSharedMemoryLanes } from '../query/useSharedMemoryLanes'
import { useUpdateMemoryLaneView } from '../query/useMemoryLane'
import { useUser } from '../context/UserContext'
import {
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Stack,
  Badge,
} from '@mui/material'
import MemoryDialog from './MemoryDialog'
import MemoryLaneTitle from './MemoryLaneTitle'
import { SharedMemoryLaneResponse } from '../typings'


export default function SharedMemoryLanes({userId}:{userId: number}) {
  const [selectedLane, setSelectedLane] = useState<{ id: number; name: string; shareId: number; hasViewed: number } | null>(null)
  const { data: sharedLanes, isLoading } = useGetSharedMemoryLanes({ userId: userId})
  const updateViewMutation = useUpdateMemoryLaneView()

  const handleViewMemories = (lane: SharedMemoryLaneResponse) => {
    setSelectedLane({
      id: lane.memory_lane_id,
      name: lane.name,
      shareId: lane.id,
      hasViewed: lane.has_viewed,
    })

    // Update view status if not viewed
    if (lane.has_viewed === 0) {
      updateViewMutation.mutate({
        id: lane.id,
        has_viewed: 1,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <CircularProgress />
      </div>
    )
  }
  const memoryLanes = sharedLanes?.memory_lanes || []

  return (
    <div className="p-4">
      <Typography variant="h5" gutterBottom>
        Shared Memory Lanes
      </Typography>
      <Grid container spacing={3}>
        {memoryLanes.map((lane) => (
          <Grid item xs={12} sm={12} md={12} key={lane.id}>
            <Card>
              <CardContent>
                <Stack spacing={4} direction="row" alignItems="center">
                  <Badge
                    color="error"
                    variant="dot"
                    invisible={(lane as unknown as SharedMemoryLaneResponse).has_viewed === 1}
                    sx={{ '.MuiBadge-badge': { right: -8, top: 8 } }}
                  >
                    <MemoryLaneTitle memoryLaneId={lane?.memory_lane_id} />
                  </Badge>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewMemories(lane as unknown as SharedMemoryLaneResponse)}
                  >
                    View Memories
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {memoryLanes.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" className="text-center">
              No shared memory lanes found
            </Typography>
          </Grid>
        )}
      </Grid>

      {selectedLane && (
        <MemoryDialog
          open={!!selectedLane}
          onClose={() => setSelectedLane(null)}
          memoryLaneId={selectedLane.id}
          memoryLaneName={selectedLane.name}
        />
      )}
    </div>
  )
} 