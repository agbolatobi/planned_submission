import { useQuery } from "@tanstack/react-query";
import { GetAllUsersResponse } from "../typings";
import { API_URL } from "../config";

export const useGetAllUsers = () => {
  return useQuery<GetAllUsersResponse>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/user/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    },
  });
}; 