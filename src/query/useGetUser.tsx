import { useQuery } from "@tanstack/react-query";
import { GetUserParams, User } from "../typings";
import { API_URL } from "../config";

export const useGetUser = (params: GetUserParams) => {
  return useQuery<User>({
    queryKey: ["user", params.email],
    enabled: !!params.email,
    queryFn: async () => {
      const response = await fetch(`${API_URL}/user?email=${params.email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      return response.json();
    },
  });
};