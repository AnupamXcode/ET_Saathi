import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import { 
  NewsAnalysisResult, 
  ScenarioResult, 
  DecisionResult, 
  SimulationResult,
  UserProfile,
  HistoryItem
} from "../lib/types";

// ============================================
// PROFILE HOOKS
// ============================================
export function useProfile() {
  return useQuery<UserProfile>({
    queryKey: ["profile"],
    queryFn: () => apiFetch<UserProfile>("/profile"),
    retry: 1,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => apiFetch<UserProfile>("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

// ============================================
// ANALYSIS ENGINE HOOKS
// ============================================
export function useAnalyzeNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newsText: string) => apiFetch<NewsAnalysisResult>("/analyze-news", {
      method: "POST",
      body: JSON.stringify({ newsText }),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["history"] }),
  });
}

export function useRunScenario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (query: string) => apiFetch<ScenarioResult>("/scenario", {
      method: "POST",
      body: JSON.stringify({ query }),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["history"] }),
  });
}

export function useDecisionEngine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { stockSymbol: string, newsContext?: string }) => apiFetch<DecisionResult>("/decision", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["history"] }),
  });
}

export function useSimulation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { stockSymbol: string, amount: number, years: number }) => apiFetch<SimulationResult>("/simulate", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["history"] }),
  });
}

export function useHistory() {
  return useQuery<{ items: HistoryItem[] }>({
    queryKey: ["history"],
    queryFn: () => apiFetch<{ items: HistoryItem[] }>("/history"),
  });
}
