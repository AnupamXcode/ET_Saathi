import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import { User } from "../lib/types";
import { useLocation } from "wouter";

export function useAuth() {
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["auth-me"],
    queryFn: () => apiFetch<User>("/auth/me"),
    retry: false,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: any) => apiFetch<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
    onSuccess: (data) => {
      localStorage.setItem("et_saathi_token", data.token);
      queryClient.setQueryData(["auth-me"], data.user);
      setLocation("/");
    },
  });

  const signupMutation = useMutation({
    mutationFn: (userData: any) => apiFetch<any>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
    onSuccess: (data) => {
      localStorage.setItem("et_saathi_token", data.token);
      queryClient.setQueryData(["auth-me"], data.user);
      setLocation("/");
    },
  });

  const logout = () => {
    localStorage.removeItem("et_saathi_token");
    queryClient.setQueryData(["auth-me"], null);
    setLocation("/login");
  };

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    signup: signupMutation.mutateAsync,
    isSigningUp: signupMutation.isPending,
    logout,
  };
}
