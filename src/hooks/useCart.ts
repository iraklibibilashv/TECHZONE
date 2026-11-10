import { useQuery } from "@tanstack/react-query";
import { getCart } from "../services/api";

export function useCart(isLoggedIn: boolean) {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isLoggedIn,
    retry: false,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
}
