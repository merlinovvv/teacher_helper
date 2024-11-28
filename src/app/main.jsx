import { createRoot } from 'react-dom/client';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { PrimeReactProvider } from 'primereact/api';
import AppRoutes from './AppRoutes.jsx';
import Localization from './Localization.jsx';
import LayoutProvider from '../context/LayoutContext.jsx';
import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import '../assets/styles/index.css';
import 'primereact/resources/themes/lara-light-teal/theme.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

createRoot(document.getElementById('root')).render(
  <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
    <PrimeReactProvider value={{ ripple: true }}>
      <LayoutProvider>
        <Localization />
        <AppRoutes />
      </LayoutProvider>
    </PrimeReactProvider>
  </PersistQueryClientProvider>
);
