import { Navigate, Route, Routes } from 'react-router-dom';

import { ComicsList } from '../components/ComicsList';

import { Header } from '../components/Header';

export function AppRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/comics/list' element={<ComicsList />} />
        <Route path='*' element={<Navigate replace to='/comics/list' />} />
      </Routes>
    </>
  );
}
