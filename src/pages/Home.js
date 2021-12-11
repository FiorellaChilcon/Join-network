
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className='home-container'>
      <h1>Welcome, {currentUser.email}</h1>
    </div>
  )
}
