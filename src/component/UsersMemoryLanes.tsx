import { useState } from 'react';
import { useGetMemoryLanes } from '../query/useGetMemoryLanes';
import { useUser } from '../context/UserContext';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  CircularProgress,
  Stack,
} from '@mui/material';
import { MemoryLane } from '../typings';
import MemoryDialog from './MemoryDialog';
import AddMemoryDialog from './AddMemoryDialog';
import ShareMemoryLaneDialog from './ShareMemoryLaneDialog'

export default function UsersMemoryLanes() {
  const { user } = useUser();
  const [selectedLane, setSelectedLane] = useState<{ id: number; name: string } | null>(null);
  const [addMemoryLane, setAddMemoryLane] = useState<number | null>(null);
  const [shareMemoryLaneId, setShareMemoryLaneId] = useState<number | null>(null)
  const { data: memoryLanes, isLoading } = useGetMemoryLanes({ 
    userId: user?.id || 0 
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Typography variant="h5" gutterBottom>
        Your Memory Lanes
      </Typography>
      <Grid container spacing={3}>
        {memoryLanes?.memory_lanes.map((lane: MemoryLane) => (
          <Grid item xs={12} sm={12} md={12} key={lane.id}>
            <Card>
              <CardContent>
                <Stack spacing={4} direction="row">
                <Typography variant="h6" gutterBottom>
                  {lane.name}
                </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => setSelectedLane({ id: lane.id, name: lane.name })}
                  >
                    View Memories
                  </Button>
                  <Button 
                    variant="contained" 
                    color="secondary"
                    onClick={() => setAddMemoryLane(lane.id)}
                  >
                    Add Memory
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => setShareMemoryLaneId(lane.id)}
                  >
                    Share
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {(!memoryLanes?.memory_lanes || memoryLanes.memory_lanes.length === 0) && (
          <Grid item xs={12}>
            <Typography variant="body1" className="text-center">
              No memory lanes found
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

      <AddMemoryDialog
        open={!!addMemoryLane}
        onClose={() => setAddMemoryLane(null)}
        memoryLaneId={addMemoryLane || 0}
      />

      <ShareMemoryLaneDialog
        open={shareMemoryLaneId !== null}
        onClose={() => setShareMemoryLaneId(null)}
        memoryLaneId={shareMemoryLaneId || 0}
      />
    </div>
  );
} 