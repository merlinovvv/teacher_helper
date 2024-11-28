import { useMutation, useQuery } from '@tanstack/react-query';
import { get, post } from '../../../shared/utils/metods.js';

const mainUrl = import.meta.env.VITE_MAIN_API;

export function useSaveGradesByGroupsSettings(payload) {
  return useMutation({
    mutationKey: ['grades-by-groups-settings'],
    mutationFn: () => saveGradesByGroupsSettings(payload),
  });
}
async function saveGradesByGroupsSettings(payload) {
  return post(mainUrl + 'grades-groups/groups', payload);
}

export function useGetGradesByGroupsSettings() {
  return useQuery({
    queryKey: ['get-grades-by-groups-settings'],
    queryFn: () => getGradesByGroupsSettings(),
  });
}
async function getGradesByGroupsSettings() {
  return get(mainUrl + 'grades-groups/groups');
}
