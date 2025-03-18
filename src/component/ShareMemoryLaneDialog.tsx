import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material'
import { useState } from 'react'
import { useGetAllUsers } from '../query/useGetAllUsers'
import { useShareMemoryLane } from '../query/useShareMemoryLane'

interface ShareMemoryLaneDialogProps {
  open: boolean
  onClose: () => void
  memoryLaneId: number
}

interface User {
  id: number
  email: string
}

export default function ShareMemoryLaneDialog({
  open,
  onClose,
  memoryLaneId,
}: ShareMemoryLaneDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const { data: usersData, isLoading: isLoadingUsers } = useGetAllUsers()
  const shareMutation = useShareMemoryLane()

  const filteredUsers = usersData?.users.filter((user: User) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const handleShare = async (userId: number) => {
    try {
      await shareMutation.mutateAsync({
        user_id: userId,
        memory_lane_id: memoryLaneId,
      }).then(() => {
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
          onClose()
        }, 500) // Close dialog after 1.5 seconds
      })
    } catch (error) {
      console.error('Failed to share memory lane:', error)
    }
  }

  const handleCloseSnackbar = () => {
    setShowSuccess(false)
  }

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Share Memory Lane</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search Users"
            type="text"
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={shareMutation.isPending}
          />
          {isLoadingUsers ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <CircularProgress />
            </div>
          ) : (
            <List sx={{ mt: 2 }}>
              {filteredUsers.map((user: User) => (
                <ListItem key={user.id} disablePadding>
                  <ListItemButton 
                    onClick={() => handleShare(user.id)}
                    disabled={shareMutation.isPending}
                    sx={{
                      opacity: shareMutation.isPending ? 0.5 : 1,
                      cursor: shareMutation.isPending ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <ListItemText primary={user.email} />
                    {shareMutation.isPending && (
                      <CircularProgress size={20} sx={{ ml: 1 }} />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
              {filteredUsers.length === 0 && (
                <ListItem>
                  <ListItemText primary="No users found" />
                </ListItem>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={onClose} 
            color="primary"
            disabled={shareMutation.isPending}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Memory Lane shared successfully!
        </Alert>
      </Snackbar>
    </>
  )
} 