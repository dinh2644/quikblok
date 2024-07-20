import { useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

interface UserInfo {
  [key: string]: string;
}

const Login = () => {
  const [data, setData] = useState<UserInfo>({
    username: "",
    password: "",
  });

  const navigate = useNavigate()

  // handle login
  const handleLoginUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { username, password } = data;
    try {
      const { data } = await axios.post(
        "/login",
        {
          username,
          password,
        }
      );
      if (data.error) {
        console.error(data.error);
        toast.error(data.error)
      } else {
        setData({
          username: "",
          password: "",
        });
        localStorage.setItem('token',data.token)
        window.location.href = "/home"
        // window.location.reload();
        // navigate("/home");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="card my-5">
                <form className="card-body cardbody-color p-lg-5">
                  <div className="text-center mb-5">
                    <h1>QuikBlok</h1>
                  </div>

                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="Username"
                      aria-describedby="emailHelp"
                      placeholder="Username"
                      value={data.username}
                      onChange={(e) =>
                        setData({ ...data, username: e.target.value.trim() })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      value={data.password}
                      onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                      }
                    />
                  </div>
                  <Link to="/forgotPassword" style={{ textDecoration: 'none', fontSize: '15px', paddingLeft: '3px' }}>Forgot Password</Link>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-color px-5 mb-5 w-100"
                      onClick={handleLoginUser}
                    >
                      Login
                    </button>
                  </div>
                  <div
                    id="emailHelp"
                    className="form-text text-center mb-5 text-dark"
                  >
                    Not Registered?{" "}
                    <Link to="/register" className="text-dark fw-bold">
                      Create an account
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
