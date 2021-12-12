import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Navbar from './common/Navbar';
import ForgotPassword from './pages/ForgotPassword';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';
import PrivateRoute from './common/PrivateRoute';
import PublicRoute from './common/PublicRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar/>
        <div className="app-body">
          <Routes>
            <Route path='/' element={<PrivateRoute><Home/></PrivateRoute>}/>
            <Route path='/sign-up' element={<PublicRoute><SignUp/></PublicRoute>}/>
            <Route path='/sign-in' element={<PublicRoute><SignIn/></PublicRoute>}/>
            <Route path='/forgot-password' element={<PublicRoute><ForgotPassword/></PublicRoute>}/>
          </Routes>
        </div>
      </AuthProvider>
  </Router>
  );
}

export default App;
