import { useMutation, useQuery } from '@tanstack/react-query';
import { get, post, remove } from '../../../shared/utils/metods.js';

const mainUrl = import.meta.env.VITE_MAIN_API;

export function useSaveSubjects(payload) {
  return useMutation({
    mutationKey: ['subjects-settings-save'],
    mutationFn: () => saveSubjects(payload),
  });
}

async function saveSubjects(payload) {
  return post(mainUrl + 'grades-groups/subjects', payload);
}

export function useGetSubjects() {
  return useQuery({
    queryKey: ['subjects-settings-get'],
    queryFn: () => getSubjects(),
  });
}

async function getSubjects() {
  return get(mainUrl + 'grades-groups/subjects');
}

export function useDeleteSubjects(id) {
  return useMutation({
    mutationKey: ['classes-settings-delete'],
    mutationFn: () => deleteSubjects(id),
  });
}

async function deleteSubjects(id) {
  return remove(mainUrl + `grades-groups/subjects/?_id=${id}`);
}
