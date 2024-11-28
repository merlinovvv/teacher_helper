import { useMutation, useQuery } from '@tanstack/react-query';
import { get, postFiles, remove } from '../../../../shared/utils/metods.js';
import { buildApiUrl } from '../../../../shared/utils/utils.js';

const mainUrl = import.meta.env.VITE_MAIN_API;

export function useSaveReport(payload) {
  return useMutation({
    mutationKey: ['report-save'],
    mutationFn: () => saveReport(payload),
  });
}

async function saveReport(payload) {
  const url = buildApiUrl(mainUrl, 'grades-groups/report', {
    subject: payload?.subject,
    schoolClass: payload?.schoolClass,
  });

  const formData = new FormData();
  formData.append('filePath', payload?.filePath);
  formData.append('file', payload?.file);

  return postFiles(url, formData);
}

export function useGetReport(payload) {
  return useQuery({
    queryKey: ['report-get'],
    queryFn: () => getReport(payload),
  });
}

async function getReport(id) {
  const url = buildApiUrl(mainUrl, 'grades-groups/report', {
    _id: id,
  });
  return get(url);
}

export function useDeleteReport(id) {
  return useMutation({
    mutationKey: ['report-delete'],
    mutationFn: () => deleteReport(id),
  });
}

async function deleteReport(id) {
  return remove(mainUrl + `grades-groups/report/?_id=${id}`);
}
