/**
 * Main App Component - Routes and layout
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/pages/Dashboard/Dashboard';
import FilesPage from '@/pages/Files/FilesPage';
import BrowsePage from '@/pages/Browse/BrowsePage';
import FoldersPage from '@/pages/Folders/FoldersPage';
import FolderDetailPage from '@/pages/Folders/FolderDetailPage';
import CategoriesPage from '@/pages/Categories';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/all-folders" element={<FoldersPage />} />
        <Route path="/files" element={<FilesPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/folders/:id" element={<FolderDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
