import { useMutation } from '@tanstack/react-query';
import { authorize } from '../../../../../shared/utils/metods.js';

const mainUrl = import.meta.env.VITE_MAIN_API;

export function useLogin(payload) {
  return useMutation({
    mutationKey: ['subjects-settings-save'],
    mutationFn: () => getLogin(payload),
  });
}

async function getLogin(payload) {
  return authorize(mainUrl + 'auth/login', payload);
}
