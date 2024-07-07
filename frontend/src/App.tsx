import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from "./hooks/useAuthContext";
import axios from "axios";
// CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";

// Pages
const AuthenticatedApp = React.lazy(() => import('./pages/AuthenticatedApp'));
const UnauthenticatedApp = React.lazy(() => import('./pages/UnauthenticatedApp'));

axios.defaults.baseURL = "https://quikblok.onrender.com";
axios.defaults.withCredentials = true;

const App = () => {
  const { user } = useAuthContext();

  return (
    <Router>
      <Toaster position="bottom-center" toastOptions={{ duration: 2000 }} />
        {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </Router>
  );
};

export default App;
