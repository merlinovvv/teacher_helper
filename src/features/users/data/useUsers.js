import { useQuery } from '@tanstack/react-query';
import { get } from '../../../shared/utils/metods.js';

const mainUrl = import.meta.env.VITE_MAIN_API;

export function useGetUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  });
}

async function getUsers() {
  return get(mainUrl + 'admin/users');
}
