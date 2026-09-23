import { useQuery } from '@tanstack/react-query'
import { authService } from './authService'

export function useUsers() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: () => authService.listUsers(),
  })

  return data ?? []
}
