import { useQuery } from '@tanstack/react-query';
import { get } from '../../../shared/utils/metods.js';

const mainUrl = import.meta.env.VITE_MAIN_API;

export function useCheckPayments() {
  return useQuery({
    queryKey: ['check-payments'],
    queryFn: () => getCheckPayments(),
    refetchOnWindowFocus: false
  });
}

async function getCheckPayments() {
  return get(mainUrl + 'auth/check-payment');
}
