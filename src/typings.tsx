export interface CreateUserParams {
  email: string;
}

export interface GetUserParams {
  email: string;
}

export interface GetMemoryLanesParams {
  userId: number;
}

export interface MemoryLane {
  id: number;
  name: string;
  user_id: number;
}

export interface Memory {
  id: number;
  name: string;
  description: string;
  image_url: string;
  memory_lane_id: number;
  timestamp: string;
  file?: File;
}

export interface GetMemoriesParams {
  memoryLaneId: number;
}

export interface CreateMemoryLaneParams {
  user_id: number;
  name: string;
}

export interface ShareMemoryLaneParams {
  user_id: number;
  memory_lane_id: number;
}

export interface UpdateMemoryLaneViewParams {
  id: number;
  has_viewed: number;
}

export interface GetSharedMemoryLanesParams {
  userId: number;
}

export interface User {
  id: number;
  email: string;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export interface GetAllUsersResponse {
  users: User[];
}

export interface SharedMemoryLane {
  id: number;
  name: string;
  user_id: number;
}

export interface GetMemoryLaneParams {
  id: number
}

export interface GetMemoryLaneResponse {
  memory_lane: MemoryLane
}

export interface SharedMemoryLaneResponse {
  id: number
  memory_lane_id: number
  has_viewed: number
  name: string
}
