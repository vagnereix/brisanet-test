import { BrowserRouter } from 'react-router-dom';
import './styles/global.scss';

import { ToastContainer } from 'react-toastify';
import { AppRoutes } from './routes/app.routes';

import { LoadScript } from '@react-google-maps/api';
import { SearchProvider } from './hooks/useSearch';

type Libraries = (
  | 'drawing'
  | 'geometry'
  | 'localContext'
  | 'places'
  | 'visualization'
)[];

const libraries: Libraries = ['places'];

export function App() {
  return (
    <>
      <BrowserRouter>
        <SearchProvider>
          <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY as string}
            libraries={libraries}
          >
            <AppRoutes />
            <ToastContainer />
          </LoadScript>
        </SearchProvider>
      </BrowserRouter>
    </>
  );
}
