import { useMutation } from '@tanstack/react-query';
import { authorize } from '../../../../../shared/utils/metods.js';

const mainUrl = import.meta.env.VITE_MAIN_API;

export function useReg(payload) {
  return useMutation({
    mutationKey: ['reg'],
    mutationFn: () => getReg(payload),
  });
}

async function getReg(payload) {
  return authorize(mainUrl + 'auth/register', payload);
}
