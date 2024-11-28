import { useQuery } from '@tanstack/react-query';
import { buildApiUrl } from '../../../../shared/utils/utils.js';
import { get } from '../../../../shared/utils/metods.js';

const mainUrl = import.meta.env.VITE_MAIN_API;

export function useGetReports() {
  return useQuery({
    queryKey: ['reports-get'],
    queryFn: () => getReports(),
  });
}

async function getReports() {
  const url = buildApiUrl(mainUrl, 'grades-groups/reports');
  return get(url);
}
