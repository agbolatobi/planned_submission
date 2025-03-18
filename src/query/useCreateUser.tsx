import { useMutation } from "@tanstack/react-query";
import { CreateUserParams } from "../typings";
import { API_URL } from "../config";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (params: CreateUserParams) => {
      const response = await fetch(`${API_URL}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      return response.json();
    },
  });
}; 