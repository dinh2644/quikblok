import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface UserInfo {
  [key: string]: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<UserInfo>({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });

  // handle registration
  const handleRegisterUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { email, firstName, lastName, username, password } = data;
    try {
      if(!email || !firstName || !lastName || !username || !password){
        toast.error("Inputs cannot be empty!")
        return;
      }
     
      const { data } = await axios.post("/register", {
        email,
        firstName,
        lastName,
        username,
        password,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({
          email: "",
          firstName: "",
          lastName: "",
          username: "",
          password: "",
        });
        navigate("/");
        toast.success("A verification link has been sent to your email.");
      }
    } catch (error) {
      console.error(error);
    }
  };


  const handleEmailChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setData({ ...data, email });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    const password = e.target.value;
    setData({...data,password});
  }

  return (
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
                    type="email"
                    className="form-control"
                    id="Email"
                    aria-describedby="emailHelp"
                    placeholder="Email"
                    value={data.email}                   
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="Firstname"
                    placeholder="First name"
                    value={data.firstName}
                    onChange={(e) =>
                      setData({ ...data, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="Lastname"
                    placeholder="Last name"
                    value={data.lastName}
                    onChange={(e) =>
                      setData({ ...data, lastName: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="Username"
                    placeholder="Username"
                    value={data.username}
                    onChange={(e) =>
                      setData({ ...data, username: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="Password"
                    placeholder="Password"
                    value={data.password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-color px-5 mb-5 w-100"
                    onClick={handleRegisterUser}
                  >
                    Sign Up
                  </button>
                </div>
                <div
                  id="emailHelp"
                  className="form-text text-center mb-5 text-dark"
                >
                  Already have an account?{" "}
                  <Link to="/" className="text-dark fw-bold">
                    Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
