import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import ProfilePage from './ProfilePage';
import PageNotFound from './PageNotFound';
import { useAuthContext } from '../hooks/useAuthContext';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import EmailVerify from './EmailVerified';


const AuthenticatedApp = () => {
  const { user } = useAuthContext();

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/profile" element={<ProfilePage  />} />
      <Route path="/forgotPassword" element={<ForgotPassword user={user} />} />
      <Route path="/resetPassword/:token" element={<ResetPassword />} />
      <Route path="/preverify/:token" element={<EmailVerify user={user}/>} />
      <Route path="*" element={<PageNotFound user={user}/>} />
    </Routes>
    </>
  );
};

export default AuthenticatedApp;