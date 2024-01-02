import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/forgotPassword", {
        email,
      });

      if (data.error) {
        toast.error(data.error);
        return;
      } else {
        navigate("/Login");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
        <div className="bg-white p-3 rounded w-25">
          <h4>Forgot Password</h4>
          <form>
            <div className="mb-3">
              <label htmlFor="email">
                <strong>Email</strong>
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter Email"
                autoComplete="off"
                name="email"
                className="form-control rounded-0"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-success w-100 rounded-0"
              onClick={handleSubmit}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
