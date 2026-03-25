import { RouterProvider } from 'react-router';
import { router } from './routes';
import { UserProvider } from './lib/context/UserContext';

export default function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}
