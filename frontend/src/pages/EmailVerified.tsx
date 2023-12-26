import "../assets/EmailVerified.css";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };

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
  );
};

export default EmailVerify;
