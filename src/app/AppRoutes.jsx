import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Home from '../features/home/Home.jsx';
import GradesByGroups from '../features/gradesByGroups/GradesByGroups.jsx';
import GradesByGroupsReports from '../features/gradesByGroups/gradesByGroupsReports/GradesByGroupsReports.jsx';
import GradesByGroupsSettings from '../features/gradesByGroups/gradesByGroupsSettings/GradesByGroupsSettings.jsx';
import Report from '../features/gradesByGroups/gradesByGroupsReports/components/Report/Report.jsx';
import Payment from '../features/payment/Payment.jsx';
import Authorize from '../features/authorize/Authorize.jsx';
import Users from '../features/users/Users.jsx';

function AppRoutes() {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <Home />,
        children: [
          {
            index: true,
            path: '/',
            element: <Navigate to="grades-by-groups" />,
          },
          {
            path: 'grades-by-groups',
            element: <GradesByGroups />,
            children: [
              {
                path: '',
                element: <Navigate to="reports" />,
              },
              {
                path: 'reports',
                element: <GradesByGroupsReports />,
                children: [
                  {
                    path: ':report_id',
                    element: <Report />,
                  },
                ],
              },
              {
                path: 'settings',
                element: <GradesByGroupsSettings />,
              },
            ],
          },
          {
            path: 'users',
            element: <Users />
          }
        ],
      },
      {
        path: 'payment',
        element: <Payment />,
      },
      {
        path: 'authorize',
        element: <Authorize />
      },
    ],
    {
      future: {
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
      },
    }
  );
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
      }}
    />
  );
}

export default AppRoutes;
