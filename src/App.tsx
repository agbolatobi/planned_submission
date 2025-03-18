import { CubeIcon } from '@heroicons/react/20/solid'
import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import UserLogin from './component/UserLogin'
import Dashboard from './component/Dashboard'
import { UserProvider, useUser } from './context/UserContext'

const queryClient = new QueryClient()

function AppContent() {
    const { user } = useUser()

    return (
        <div className="min-h-screen p-4">
            <div className='w-full'>
                <div className='overflow-hidden rounded-lg bg-white shadow min-h-screen w-full'>
                    <div>
                        <div className='flex items-center'>
                            <CubeIcon className='h-16 w-16 inline-block' />
                            <h1 className='text-4xl font-semibold text-gray-900 mb-4 ml-4 mt-4'>
                                Memory lane
                            </h1>
                        </div>
                        {user ? <Dashboard /> : <UserLogin />}
                    </div>
                </div>
            </div>
        </div>
    )
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <AppContent />
            </UserProvider>
        </QueryClientProvider>
    )
}

export default App
