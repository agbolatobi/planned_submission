import { Button } from '@mui/material'
import { useUser } from '../context/UserContext'
import UsersMemoryLanes from './UsersMemoryLanes'
import CreateMemoryLaneDialog from './CreateMemoryLaneDialog'
import { useState } from 'react'
import SharedMemoryLanes from './SharedMemoryLanes'

export default function Dashboard() {
    const { user, setUser } = useUser()
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    const handleLogout = () => {
        setUser(null)
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-8">
                <div className="text-lg">
                    Logged in as: <span className="font-semibold">{user?.email}</span>
                </div>
                <div className="flex gap-4">
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => setIsCreateDialogOpen(true)}
                    >
                        Create Memory Lane
                    </Button>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                    <UsersMemoryLanes />
                </div>
                <div className="col-span-6">

                    {user && <SharedMemoryLanes userId={user.id} />}
                </div>
            </div>

            <CreateMemoryLaneDialog 
                open={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
            />
        </div>
    )
} 