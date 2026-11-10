import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "../services/api";

export function useFavorites(isLoggedIn: boolean) {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: isLoggedIn,
  });
}
