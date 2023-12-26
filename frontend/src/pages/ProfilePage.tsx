import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

interface IdProp {
  id: string;
}

interface UserInfo {
  [key: string]: string;
}

const ProfilePage = ({ id }: IdProp) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("accountDetails");
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
  });

  // handle tab click
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  // logout user
  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/logout",
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/");
        console.log("Logged out successfully");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // update user
  const handleUpdateUser = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const response = await axios.put(`/updateUser/${id}`, userInfo);

      if (response) {
        setUserInfo({
          email: "",
          firstName: "",
          lastName: "",
          username: "",
        });
        toast.success("Success! Your information has been updated.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <>
      <section>
        <div className="container">
          <h1>Edit Profile</h1>
          <hr />
          <div className="row">
            {/* Left column - Tabs */}
            <div className="col-md-3">
              <div className="list-group">
                <a
                  href="#"
                  className={`list-group-item list-group-item-action ${
                    activeTab === "accountDetails" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("accountDetails")}
                >
                  Personal
                </a>
                <a
                  href="#"
                  className={`list-group-item list-group-item-action ${
                    activeTab === "changeEmail" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("changeEmail")}
                >
                  Email
                </a>
                <a
                  href="#"
                  className={`list-group-item list-group-item-action ${
                    activeTab === "changePassword" ? "active" : ""
                  }`}
                  onClick={() => handleTabClick("changePassword")}
                >
                  Password
                </a>
                <button
                  className="list-group-item list-group-item-action text-danger font-weight-bold"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </div>

            {/* Edit form column */}
            <div className="col-md-9 personal-info">
              {/* Personal Info */}
              {activeTab === "accountDetails" && (
                <>
                  <h3>Change Personal Info</h3>
                  <form className="form-horizontal" role="form">
                    <div className="form-group">
                      <label className="col-lg-3 control-label">
                        First name:
                      </label>
                      <div className="col-lg-8">
                        <input
                          className="form-control"
                          type="text"
                          value={userInfo.firstName}
                          name="firstName"
                          id="firstName"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-lg-3 control-label">
                        Last name:
                      </label>
                      <div className="col-lg-8">
                        <input
                          className="form-control"
                          type="text"
                          value={userInfo.lastName}
                          name="lastName"
                          id="lastName"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-lg-3 control-label">Email:</label>
                      <div className="col-lg-8">
                        <input
                          className="form-control"
                          type="text"
                          value={userInfo.email}
                          name="email"
                          id="email"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-3 control-label">
                        Username:
                      </label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          type="text"
                          value={userInfo.username}
                          name="username"
                          id="username"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-3 control-label"></label>
                      <div className="col-md-8">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          value="Update Information"
                          onClick={handleUpdateUser}
                        >
                          Update
                        </button>
                        <button
                          type="reset"
                          className="btn btn-default"
                          value="Update Information"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}

              {/* Change Email */}
              {activeTab === "changeEmail" && (
                <>
                  <h3>Change Email</h3>
                  <form className="form-horizontal" role="form">
                    <div className="form-group">
                      <label className="col-md-3 control-label">
                        New Email:
                      </label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          type="email"
                          value=""
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-3 control-label">
                        Confirm Email:
                      </label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          type="email"
                          value=""
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-3 control-label"></label>
                      <div className="col-md-8">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          value="Update Information"
                        >
                          Save
                        </button>
                        <button
                          type="reset"
                          className="btn btn-default"
                          value="Update Information"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}

              {/* Change Password */}
              {activeTab === "changePassword" && (
                <>
                  <h3>Change Password</h3>
                  <form className="form-horizontal" role="form">
                    <div className="form-group">
                      <label className="col-md-3 control-label">
                        Old Password:
                      </label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          type="password"
                          value=""
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-md-3 control-label">
                        New password:
                      </label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          type="password"
                          value=""
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-md-3 control-label">
                        Confirm password:
                      </label>
                      <div className="col-md-8">
                        <input
                          className="form-control"
                          type="password"
                          value=""
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="col-md-3 control-label"></label>
                      <div className="col-md-8">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          value="Update Information"
                          onClick={handleUpdateUser}
                        >
                          Save
                        </button>
                        <button
                          type="reset"
                          className="btn btn-default"
                          value="Update Information"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
        <hr />
      </section>
    </>
  );
};

export default ProfilePage;
