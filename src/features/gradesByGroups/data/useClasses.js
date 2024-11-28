import { useMutation, useQuery } from '@tanstack/react-query';
import { get, post, remove } from '../../../shared/utils/metods.js';

const mainUrl = import.meta.env.VITE_MAIN_API;

export function useSaveClasses(payload) {
  return useMutation({
    mutationKey: ['classes-settings-save'],
    mutationFn: () => saveClasses(payload),
  });
}

async function saveClasses(payload) {
  return post(mainUrl + 'grades-groups/classes', payload);
}

export function useGetClasses() {
  return useQuery({
    queryKey: ['classes-settings-get'],
    queryFn: () => getClasses(),
  });
}

async function getClasses() {
  return get(mainUrl + 'grades-groups/classes');
}

export function useDeleteClasses(id) {
  return useMutation({
    mutationKey: ['classes-settings-delete'],
    mutationFn: () => deleteClasses(id),
  });
}

async function deleteClasses(id) {
  return remove(mainUrl + `grades-groups/classes/?_id=${id}`);
}
