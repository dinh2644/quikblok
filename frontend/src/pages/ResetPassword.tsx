import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";


const ResetPassword = () => {
  const isLoggedIn = localStorage.getItem('token')

  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { token } = useParams();

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (!password || password.length < 6) {
        toast.error("New password must be at least 6 characters long.");
        return;
      }

      const { data } = await axios.post("/resetPassword", {
        password,
        resetToken: token,
      });

      if (data.error) {
        toast.error(data.error);
        return;
      } else {
        setTimeout(() => {
          const loggedIn = isLoggedIn ? "/profile" : "/login"
          navigate(loggedIn);
          window.location.reload();
        }, 2000);
        toast.success("Password successfully updated!")
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
        <div className="bg-white p-3 rounded w-25">
          <h4>Reset Password</h4>
          <form>
            <div className="mb-3">
              <label htmlFor="password">
                <strong>New Password</strong>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                autoComplete="off"
                id="password"
                name="password"
                className="form-control rounded-0"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 rounded-0"
              onClick={handleSubmit}
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
