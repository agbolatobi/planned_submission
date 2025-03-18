import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Typography, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  DialogActions,
  Box,
  IconButton,
} from '@mui/material';
import { Memory } from '../typings';
import { useGetMemories } from '../query/useMemories';
import { APP_URL } from '../config';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface MemoryDialogProps {
  open: boolean;
  onClose: () => void;
  memoryLaneId: number;
  memoryLaneName: string;
}

export default function MemoryDialog({ open, onClose, memoryLaneId, memoryLaneName }: MemoryDialogProps) {
  const { data: memoriesData, isLoading } = useGetMemories({ memoryLaneId });

  const sortedMemories = memoriesData?.memory_lanes?.sort((a: Memory, b: Memory) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ) || [];

  const handleViewImage = (imageUrl: string) => {
    window.open(`${APP_URL}/${imageUrl}`, '_blank');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Memories from {memoryLaneName}
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <CircularProgress />
          </div>
        ) : (
          <List>
            {sortedMemories.map((memory: Memory) => (
              <ListItem key={memory.id} divider>
                <ListItemText
                  primary={memory.name}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {new Date(memory.timestamp).toLocaleDateString()}
                      </Typography>
                      <br />
                      {memory.description}
                    </>
                  }
                />
                {memory.image_url && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img 
                      src={`${APP_URL}/${memory.image_url}`} 
                      alt={memory.name}
                      style={{ maxWidth: '100px', marginLeft: '16px' }}
                    />
                    <IconButton
                      onClick={() => handleViewImage(memory.image_url)}
                      color="primary"
                      size="small"
                      title="View full image"
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  </Box>
                )}
              </ListItem>
            ))}
            {sortedMemories.length === 0 && (
              <Typography variant="body1" className="text-center p-4">
                No memories found in this lane
              </Typography>
            )}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
} 