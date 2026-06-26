import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AppLayout } from './ui/AppLayout';
import { HomePage } from './pages/HomePage';
import { NewProjectPage } from './pages/NewProjectPage';
import { NoteDetailPage } from './pages/NoteDetailPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import './styles.css';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'projects',
        element: <ProjectsPage />
      },
      {
        path: 'projects/new',
        element: <NewProjectPage />
      },
      {
        path: 'projects/:projectId',
        element: <ProjectDetailPage />
      },
      {
        path: 'projects/:projectId/notes/:noteId',
        element: <NoteDetailPage />
      }
    ]
  }
]);

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
