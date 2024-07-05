import {useState, useEffect} from 'react'
import "../assets/EmailVerified.css";
import {useParams, useNavigate } from "react-router-dom";
import axios from 'axios';


const EmailVerify = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const [verificationStatus, setVerificationStatus] = useState<string>('pending');
 console.log(verificationStatus);
  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/verify/${token}`); 
          setVerificationStatus('success');
     
        
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
      }
    };

    verifyEmail();
  }, []);

  if (verificationStatus === 'pending') {
    return (
      <div className="full-page-message">
        <p>Verifying your email...</p>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="full-page-message">
        <p>Verification failed. The link may be invalid or expired.</p>
      </div>
    );
  }

  return (
    <section className="d-flex justify-content-center align-items-center">
      <div className="email-verify-container">
        <h1>Email Verified!</h1>
        <p>Your email has been successfully verified.</p>
        <button onClick={handleLogin} className="login-button">
          Login
        </button>
      </div>
    </section>
  )
  
};

export default EmailVerify;
