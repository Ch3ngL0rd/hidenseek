import { AuthProvider, useAuth } from './src/hooks/useAuth';
import { Private } from './src/navigation/private';
import { Public } from './src/navigation/public';

export default function App() {
  const auth = useAuth();

  return (
    <AuthProvider>
      {auth.user === null ?
        <Public />
        :
        <Private />
      }
    </AuthProvider>
  );
}